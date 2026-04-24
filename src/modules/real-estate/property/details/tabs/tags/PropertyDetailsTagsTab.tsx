import {useMemo, useState} from "react";
import {Check, PlusCircle, Tag as TagIcon, Trash2} from "lucide-react";
import {toast} from "sonner";

import {Button} from "#/components/ui/button.tsx";
import {Badge} from "#/components/ui/badge.tsx";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "#/components/ui/combobox.tsx";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";
import {TagRequest} from "#/modules/tags/request.hook.ts";
import type {TagModel} from "#/modules/tags/model.ts";
import {ObjectVisibility} from "#/models/PagedModel.ts";

import {DefinitionCard, EmptyState} from "../../PropertyDetailsPrimitives.tsx";

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

export function PropertyDetailsTagsTab({property}: { property?: PropertyModel.Detailed }) {
    const [selectedTagId, setSelectedTagId] = useState("")

    const assignedTagIds = property?.tags ?? []
    const availableTagsQuery = TagRequest.useQueryTags({
        page: 0,
        size: 200,
        show: ObjectVisibility.ENTITY_AND_SYSTEM,
    })
    const assignedTagsQuery = TagRequest.useGetTagsBatch(assignedTagIds)

    const addTag = PropertyApiHook.useAddPropertyTags(() => {
        toast.success("Property tag added.")
        setSelectedTagId("")
    })
    const removeTag = PropertyApiHook.useRemovePropertyTags(() => {
        toast.success("Property tag removed.")
    })

    const assignedTags = useMemo(() => {
        const resolvedTags = new Map(
            (assignedTagsQuery.data ?? []).map((tag) => [tag.id, tag] as const),
        )

        return assignedTagIds.map((tagId) => resolvedTags.get(tagId)).filter(Boolean) as TagModel.Tag[]
    }, [assignedTagIds, assignedTagsQuery.data])

    const unresolvedAssignedTagIds = useMemo(
        () => assignedTagIds.filter((tagId) => !assignedTags.some((tag) => tag.id === tagId)),
        [assignedTagIds, assignedTags],
    )

    const availableOptions = useMemo(
        () =>
            (availableTagsQuery.data?.content ?? [])
                .filter((tag) => !assignedTagIds.includes(tag.id))
                .map(toTagOption),
        [assignedTagIds, availableTagsQuery.data?.content],
    )

    const selectedOption =
        availableOptions.find((option) => option.id === selectedTagId) ?? null

    return (
        <DefinitionCard
            title="Property Tags"
            description="Manage the tags assigned to this property."
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
                                disabled={!property?.id || availableTagsQuery.isFetching || addTag.isPending}
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
                        disabled={!property?.id || !selectedTagId || addTag.isPending}
                        onClick={() => {
                            if (!property?.id || !selectedTagId) return

                            void addTag.mutateAsync({
                                propertyId: property.id,
                                tagIds: [selectedTagId],
                            })
                        }}
                    >
                        <PlusCircle className="size-4"/>
                        Add tag
                    </Button>
                </div>

                {assignedTagIds.length ? (
                    <div className="grid gap-3">
                        {assignedTags.map((tag) => (
                            <div key={tag.id} className="rounded-lg border p-4">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <TagIcon className="size-4 text-muted-foreground"/>
                                            <div className="truncate font-medium">
                                                {tag.name?.trim() || tag.id}
                                            </div>
                                        </div>
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
                                        variant="outline"
                                        size="sm"
                                        disabled={!property?.id || removeTag.isPending}
                                        onClick={() => {
                                            if (!property?.id) return

                                            void removeTag.mutateAsync({
                                                propertyId: property.id,
                                                tagIds: [tag.id],
                                            })
                                        }}
                                    >
                                        <Trash2 className="size-4"/>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {unresolvedAssignedTagIds.map((tagId) => (
                            <div key={tagId} className="rounded-lg border border-dashed p-4">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <TagIcon className="size-4 text-muted-foreground"/>
                                            <div className="truncate font-medium">{tagId}</div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            This tag is attached to the property, but its details could not be resolved.
                                        </p>
                                        <Badge variant="outline">ID: {tagId}</Badge>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!property?.id || removeTag.isPending}
                                        onClick={() => {
                                            if (!property?.id) return

                                            void removeTag.mutateAsync({
                                                propertyId: property.id,
                                                tagIds: [tagId],
                                            })
                                        }}
                                    >
                                        <Trash2 className="size-4"/>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No property tags"
                        description="Assign tags to classify this property and make it easier to organize."
                    />
                )}

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{assignedTagIds.length} assigned</span>
                    <span>&bull;</span>
                    <span>{availableOptions.length} available to add</span>
                    {availableTagsQuery.isFetching || assignedTagsQuery.isFetching ? (
                        <>
                            <span>&bull;</span>
                            <span className="inline-flex items-center gap-1">
                                <Check className="size-3.5"/>
                                Refreshing
                            </span>
                        </>
                    ) : null}
                </div>
            </div>
        </DefinitionCard>
    )
}
