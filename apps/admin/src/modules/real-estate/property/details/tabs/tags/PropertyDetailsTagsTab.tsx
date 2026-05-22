import {useMemo, useState} from "react";
import {AlertCircle, PlusCircle, Search, Tag as TagIcon, Trash2, X} from "lucide-react";
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
import {Input} from "#/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx";
import {NixModule} from "#/models/Models.ts";
import type {PropertyModel} from "@suiteonix/server";
import {PropertyApiHook} from "@suiteonix/server";
import {TagQuickViewPopover} from "#/modules/tags/components/TagQuickViewPopover.tsx";
import {TagRequest} from "@suiteonix/server";
import {TagModel} from "@suiteonix/server";
import {ObjectVisibility} from "#/models/PagedModel.ts";

import {EmptyState} from "../../PropertyDetailsPrimitives.tsx";

const ANY_MODULE = "__any_module__"
const ANY_TYPE = "__any_type__"

type TagOption = {
    id: TagModel.TagID
    label: string
    description: string
    module: string
    type: string
}

function tagLabel(tag?: TagModel.Tag | null) {
    return tag?.name?.trim() || tag?.id || "Untitled tag"
}

function tagDescription(tag?: TagModel.Tag | null) {
    return tag?.description?.trim() || "No description"
}

function tagModule(tag?: TagModel.Tag | null) {
    return tag?.module || "ALL"
}

function tagType(tag?: TagModel.Tag | null) {
    return tag?.type || "UNKNOWN"
}

function toTagOption(tag: TagModel.Tag): TagOption {
    return {
        id: tag.id,
        label: tagLabel(tag),
        description: tagDescription(tag),
        module: tagModule(tag),
        type: tagType(tag),
    }
}

function TagStat({label, value}: { label: string; value: string | number }) {
    return (
        <div className="rounded-lg border bg-background p-3">
            <div className="text-xs font-medium uppercase text-muted-foreground">{label}</div>
            <div className="mt-1 text-xl font-semibold">{value}</div>
        </div>
    )
}

export function PropertyDetailsTagsTab({property}: { property?: PropertyModel.Detailed }) {
    const [selectedTagId, setSelectedTagId] = useState("")
    const [availableSearchQuery, setAvailableSearchQuery] = useState("")
    const [assignedSearchQuery, setAssignedSearchQuery] = useState("")
    const [selectedModule, setSelectedModule] = useState<string>(NixModule.REAL_ESTATE)
    const [selectedType, setSelectedType] = useState<string>(ANY_TYPE)

    const assignedTagIds = property?.tags ?? []
    const availableTagsQuery = TagRequest.useQueryTagsFts({
        page: 0,
        size: 40,
        query: availableSearchQuery.trim() || undefined,
        module: selectedModule === ANY_MODULE ? undefined : selectedModule as NixModule,
        type: selectedType === ANY_TYPE ? undefined : selectedType as TagModel.TagType,
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
    const filteredAssignedTags = useMemo(() => {
        const query = assignedSearchQuery.trim().toLowerCase()

        if (!query) return assignedTags

        return assignedTags.filter((tag) =>
            [
                tag.id,
                tagLabel(tag),
                tagDescription(tag),
                tagModule(tag),
                tagType(tag),
                tag.colorHex,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query),
        )
    }, [assignedSearchQuery, assignedTags])
    const filteredUnresolvedAssignedTagIds = useMemo(() => {
        const query = assignedSearchQuery.trim().toLowerCase()

        if (!query) return unresolvedAssignedTagIds

        return unresolvedAssignedTagIds.filter((tagId) => tagId.toLowerCase().includes(query))
    }, [assignedSearchQuery, unresolvedAssignedTagIds])

    const availableOptions = useMemo(
        () =>
            availableTagsQuery.data.content
                .filter((tag) => !assignedTagIds.includes(tag.id))
                .map(toTagOption),
        [assignedTagIds, availableTagsQuery.data.content],
    )

    const selectedOption =
        availableOptions.find((option) => option.id === selectedTagId) ?? null
    const assignedTagGroups = useMemo(() => {
        const groups = new Map<string, TagModel.Tag[]>()

        filteredAssignedTags.forEach((tag) => {
            const key = tagModule(tag)
            groups.set(key, [...(groups.get(key) ?? []), tag])
        })

        return Array.from(groups.entries()).map(([module, tags]) => ({module, tags}))
    }, [filteredAssignedTags])
    const assignedModuleCount = useMemo(
        () => new Set(assignedTags.map((tag) => tagModule(tag))).size,
        [assignedTags],
    )
    const hasActiveAvailableFilters =
        availableSearchQuery.trim().length > 0 || selectedModule !== NixModule.REAL_ESTATE || selectedType !== ANY_TYPE
    const visibleAssignedCount = filteredAssignedTags.length + filteredUnresolvedAssignedTagIds.length
    const isRefreshing = availableTagsQuery.isFetching || assignedTagsQuery.isFetching

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold">Property tags</h2>
                    <p className="text-sm text-muted-foreground">
                        Assign searchable labels that control classification, listing context, and internal workflows.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{assignedTagIds.length} assigned</Badge>
                    <Badge variant="outline">{availableOptions.length} available</Badge>
                    {isRefreshing ? <Badge variant="secondary">Refreshing</Badge> : null}
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
                <TagStat label="Assigned" value={assignedTagIds.length}/>
                <TagStat label="Resolved" value={assignedTags.length}/>
                <TagStat label="Modules" value={assignedModuleCount}/>
                <TagStat label="Unresolved" value={unresolvedAssignedTagIds.length}/>
            </div>

            <section className="rounded-lg border bg-muted/15 p-4">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                        <h3 className="font-medium">Assign tags</h3>
                        <p className="text-sm text-muted-foreground">
                            Search by name or id, then narrow the available tag pool by module and type.
                        </p>
                    </div>
                    {hasActiveAvailableFilters ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setAvailableSearchQuery("")
                                setSelectedModule(NixModule.REAL_ESTATE)
                                setSelectedType(ANY_TYPE)
                                setSelectedTagId("")
                            }}
                        >
                            <X className="size-4"/>
                            Clear filters
                        </Button>
                    ) : null}
                </div>

                <div className="grid gap-3 xl:grid-cols-[minmax(16rem,1fr)_12rem_12rem_auto] xl:items-end">
                    <div className="grid gap-2">
                        <span className="text-sm font-medium">Available tag</span>
                        <Combobox<TagOption>
                            items={availableOptions}
                            value={selectedOption}
                            inputValue={availableSearchQuery}
                            itemToStringLabel={(item) => item.label}
                            itemToStringValue={(item) => item.id}
                            onInputValueChange={(value) => {
                                setAvailableSearchQuery(value)
                                setSelectedTagId("")
                            }}
                            onValueChange={(nextValue) => setSelectedTagId(nextValue?.id ?? "")}
                        >
                            <ComboboxInput
                                disabled={!property?.id || availableTagsQuery.isFetching || addTag.isPending}
                                placeholder="Search available tags"
                                showClear={Boolean(availableSearchQuery || selectedOption)}
                                className="w-full"
                            >
                                <Search className="size-4 text-muted-foreground"/>
                            </ComboboxInput>
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
                    </div>

                    <label className="grid gap-2">
                        <span className="text-sm font-medium">Module</span>
                        <Select
                            value={selectedModule}
                            onValueChange={(value) => {
                                setSelectedModule(value)
                                setSelectedTagId("")
                            }}
                            disabled={!property?.id || addTag.isPending}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Module"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ANY_MODULE}>All modules</SelectItem>
                                {Object.values(NixModule).map((module) => (
                                    <SelectItem key={module} value={module}>
                                        {module}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>

                    <label className="grid gap-2">
                        <span className="text-sm font-medium">Type</span>
                        <Select
                            value={selectedType}
                            onValueChange={(value) => {
                                setSelectedType(value)
                                setSelectedTagId("")
                            }}
                            disabled={!property?.id || addTag.isPending}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ANY_TYPE}>All types</SelectItem>
                                {Object.values(TagModel.TagType).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>

                    <Button
                        className="xl:min-w-32"
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
                        Assign
                    </Button>
                </div>
            </section>

            {assignedTagIds.length ? (
                <section className="space-y-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-1">
                            <h3 className="font-medium">Assigned tags</h3>
                            <p className="text-sm text-muted-foreground">
                                Tags are grouped by module so property-level and cross-module labels stay easy to scan.
                            </p>
                        </div>
                        <div className="relative md:w-72">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                value={assignedSearchQuery}
                                onChange={(event) => setAssignedSearchQuery(event.target.value)}
                                placeholder="Filter assigned tags"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {visibleAssignedCount === 0 ? (
                        <EmptyState
                            title="No matching property tags"
                            description="Adjust the assigned tag filter to show more results."
                        />
                    ) : null}

                    {assignedTagGroups.map((group) => (
                        <div key={group.module} className="rounded-lg border">
                            <div className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <Badge variant="secondary">{group.module}</Badge>
                                    <span className="text-sm text-muted-foreground">{group.tags.length} tags</span>
                                </div>
                            </div>
                            <div className="grid gap-3 p-3 lg:grid-cols-2">
                                {group.tags.map((tag) => (
                                    <div key={tag.id} className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/20">
                                        <div className="flex items-start justify-between gap-4">
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
                                                        <TagIcon
                                                            className="size-4 text-muted-foreground"
                                                            style={tag.colorHex ? {color: tag.colorHex} : undefined}
                                                        />
                                                        <span className="truncate font-medium">{tagLabel(tag)}</span>
                                                    </button>
                                                </TagQuickViewPopover>
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {tagDescription(tag)}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline">{tagType(tag)}</Badge>
                                                    <Badge variant="ghost" className="font-mono">ID: {tag.id}</Badge>
                                                    {tag.colorHex ? <Badge variant="ghost">{tag.colorHex}</Badge> : null}
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {filteredUnresolvedAssignedTagIds.length ? (
                        <div className="rounded-lg border border-dashed p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <AlertCircle className="size-4 text-muted-foreground"/>
                                <div className="font-medium">Unresolved tag references</div>
                                <Badge variant="outline">{filteredUnresolvedAssignedTagIds.length}</Badge>
                            </div>
                            <div className="grid gap-2">
                                {filteredUnresolvedAssignedTagIds.map((tagId) => (
                                    <div key={tagId} className="flex flex-col gap-3 rounded-md bg-muted/20 p-3 md:flex-row md:items-center md:justify-between">
                                        <div className="min-w-0">
                                            <div className="truncate font-mono text-sm">{tagId}</div>
                                            <p className="text-sm text-muted-foreground">
                                                This tag is attached to the property, but its details could not be resolved.
                                            </p>
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
                                ))}
                            </div>
                        </div>
                    ) : null}
                </section>
            ) : (
                <EmptyState
                    title="No property tags"
                    description="Assign tags to classify this property and make it easier to organize."
                />
            )}
        </div>
    )
}
