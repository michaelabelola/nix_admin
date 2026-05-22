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
import type {CustomerModel} from "@suiteonix/server"
import {CustomerRequest} from "@suiteonix/server"
import {TagQuickViewPopover} from "#/modules/tags/components/TagQuickViewPopover.tsx"
import type {TagModel} from "@suiteonix/server"
import {TagRequest} from "@suiteonix/server"

import {EmptyState} from "../../CustomerDetailsPrimitives.tsx"

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
        <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-semibold">Customer tags</h2>
                    <p className="text-sm text-muted-foreground">Manage labels used to classify and organize this customer.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{assignedTags.length} assigned</span>
                    <span>&bull;</span>
                    <span>{availableOptions.length} available</span>
                </div>
            </div>

            <section className="rounded-lg bg-muted/20 p-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
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
            </section>

            {assignedTags.length ? (
                <div className="grid gap-2">
                    {assignedTags.map((tag) => (
                        <div key={tag.id} className="rounded-lg bg-muted/20 p-4 transition-colors hover:bg-muted/30">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0 space-y-2">
                                    <TagQuickViewPopover tag={tag}>
                                        <button
                                            type="button"
                                            className="flex max-w-full items-center gap-2 text-left"
                                            style={tag.colorHex ? {color: tag.colorHex} : undefined}
                                        >
                                            <span
                                                className="size-2.5 shrink-0 rounded-full bg-muted-foreground"
                                                style={tag.colorHex ? {backgroundColor: tag.colorHex} : undefined}
                                            />
                                            <TagIcon className="size-4 text-muted-foreground" style={tag.colorHex ? {color: tag.colorHex} : undefined}/>
                                            <span className="truncate font-medium">
                                                {tag.name?.trim() || tag.id}
                                            </span>
                                        </button>
                                    </TagQuickViewPopover>
                                    {tag.description?.trim() ? (
                                        <p className="text-sm text-muted-foreground">
                                            {tag.description.trim()}
                                        </p>
                                    ) : null}
                                    <div className="flex flex-wrap gap-2">
                                        {tag.module ? <Badge variant="secondary">{tag.module}</Badge> : null}
                                        {tag.type ? <Badge variant="ghost">{tag.type}</Badge> : null}
                                        <Badge variant="ghost" className="font-mono">ID: {tag.id}</Badge>
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
        </div>
    )
}
