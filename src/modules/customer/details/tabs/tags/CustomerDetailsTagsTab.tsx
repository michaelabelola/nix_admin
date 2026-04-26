import {useMemo, useState} from "react"
import {PlusCircle, Tag as TagIcon, Trash2} from "lucide-react"
import {toast} from "sonner"

import {Button} from "#/components/ui/button.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "#/components/ui/combobox.tsx"
import {ObjectVisibility} from "#/models/PagedModel.ts"
import type {CustomerModel} from "#/modules/customer/model.ts"
import {CustomerRequest} from "#/modules/customer/request.hook.ts"
import {TagQuickViewPopover} from "#/modules/tags/components/TagQuickViewPopover.tsx"
import type {TagModel} from "#/modules/tags/model.ts"
import {TagRequest} from "#/modules/tags/request.hook.ts"

import {DefinitionCard, EmptyState} from "../../CustomerDetailsPrimitives.tsx"

type TagOption = {
    id: TagModel.TagID
    label: string
    description: string
    module: string
    type: string
}

function toTagOption(tag: TagModel.Tag): TagOption {
    return {
        id: tag.id,
        label: tag.name?.trim() || tag.id,
        description: tag.description?.trim() || "No description",
        module: tag.module || "ALL",
        type: tag.type || "UNKNOWN",
    }
}

export function CustomerDetailsTagsTab({customer}: { customer?: CustomerModel.Detailed }) {
    const [selectedTagId, setSelectedTagId] = useState("")

    const customerId = customer?.id
    const assignedTagsQuery = CustomerRequest.useGetCustomerTags(customerId)
    const availableTagsQuery = TagRequest.useQueryTags({
        page: 0,
        size: 200,
        show: ObjectVisibility.ENTITY_AND_SYSTEM,
    })

    const addTag = CustomerRequest.useAddCustomerTag(() => {
        toast.success("Customer tag added.")
        setSelectedTagId("")
    })
    const removeTag = CustomerRequest.useRemoveCustomerTag(() => {
        toast.success("Customer tag removed.")
    })

    const assignedTags = assignedTagsQuery.data ?? []
    const assignedTagIds = useMemo(() => assignedTags.map((tag) => tag.id), [assignedTags])
    const availableOptions = useMemo(
        () =>
            availableTagsQuery.data.content
                .filter((tag) => !assignedTagIds.includes(tag.id))
                .map(toTagOption),
        [assignedTagIds, availableTagsQuery.data.content],
    )

    const selectedOption = availableOptions.find((option) => option.id === selectedTagId) ?? null

    return (
        <DefinitionCard
            title="Customer Tags"
            description="Manage the tags assigned to this customer."
        >
            <div className="space-y-6">
                <div className="grid gap-3 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <label className="grid gap-2">
                        <span className="text-sm font-medium">Add tag</span>
                        <Combobox<TagOption>
                            items={availableOptions}
                            value={selectedOption}
                            itemToStringLabel={(item) => item.label}
                            itemToStringValue={(item) => item.id}
                            onValueChange={(nextValue) => setSelectedTagId(nextValue?.id ?? "")}
                        >
                            <ComboboxInput
                                disabled={!customerId || availableTagsQuery.isFetching || addTag.isPending}
                                placeholder="Search available tags"
                                showClear={Boolean(selectedOption)}
                                className="w-full"
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>No tags available to add.</ComboboxEmpty>
                                <ComboboxList>
                                    {availableOptions.map((option) => (
                                        <ComboboxItem key={option.id} value={option}>
                                            <div className="min-w-0">
                                                <div className="truncate font-medium">{option.label}</div>
                                                <div className="truncate text-xs text-muted-foreground">
                                                    {option.description}
                                                </div>
                                            </div>
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </label>

                    <Button
                        className="lg:min-w-32"
                        disabled={!customerId || !selectedTagId || addTag.isPending}
                        onClick={() => {
                            if (!customerId || !selectedTagId) return
                            void addTag.mutateAsync({customerId, tagId: selectedTagId})
                        }}
                    >
                        <PlusCircle className="size-4"/>
                        Add tag
                    </Button>
                </div>

                {assignedTags.length ? (
                    <div className="grid gap-3">
                        {assignedTags.map((tag) => (
                            <div key={tag.id} className="rounded-lg border p-4">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0 space-y-2">
                                        <TagQuickViewPopover tag={tag}>
                                            <button
                                                type="button"
                                                className="flex items-center gap-2 text-left"
                                                style={tag.colorHex ? {color: tag.colorHex} : undefined}
                                            >
                                                <TagIcon className="size-4 text-muted-foreground" style={tag.colorHex ? {color: tag.colorHex} : undefined}/>
                                                <div className="truncate font-medium">
                                                    {tag.name?.trim() || tag.id}
                                                </div>
                                            </button>
                                        </TagQuickViewPopover>
                                        <p className="text-sm text-muted-foreground">
                                            {tag.description?.trim() || "No description"}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline">{tag.module || "ALL"}</Badge>
                                            <Badge variant="secondary">{tag.type || "UNKNOWN"}</Badge>
                                            <Badge variant="outline">ID: {tag.id}</Badge>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        disabled={!customerId || removeTag.isPending}
                                        onClick={() => {
                                            if (!customerId) return
                                            void removeTag.mutateAsync({customerId, tagId: tag.id})
                                        }}
                                    >
                                        <Trash2 className="size-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No customer tags"
                        description="Assign tags to classify this customer and make it easier to organize."
                    />
                )}

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{assignedTags.length} assigned</span>
                    <span>&bull;</span>
                    <span>{availableOptions.length} available to add</span>
                </div>
            </div>
        </DefinitionCard>
    )
}
