import {useMemo} from "react"

import {Badge} from "#/components/ui/badge.tsx"
import {cn} from "#/lib/utils.ts"
import type {TagModel} from "#/modules/tags/model.ts"
import {TagRequest} from "#/modules/tags/request.hook.ts"
import {TagQuickViewPopover} from "#/modules/tags/components/TagQuickViewPopover.tsx";

export function TagsView({
                             tagIds,
                             className,
                         }: {
    tagIds?: string[] | null
    className?: string
}) {
    const resolvedTagIds = useMemo(
        () => Array.from(new Set((tagIds ?? []).map((tagId) => tagId.trim()).filter(Boolean))),
        [tagIds],
    )
    const tagsQuery = TagRequest.useGetTagsBatch(resolvedTagIds)
    const tagMap = useMemo(
        () => new Map(tagsQuery.data.map((tag) => [tag.id, tag])),
        [tagsQuery.data],
    )

    if (!resolvedTagIds.length) return null

    if (tagsQuery.isLoading && !tagsQuery.data.length) {
        return (
            <div className={cn("flex flex-wrap gap-2", className)}>
                <Badge variant="outline">Loading tags...</Badge>
            </div>
        )
    }

    if (tagsQuery.isError && !tagsQuery.data.length) {
        return (
            <div className={cn("flex flex-wrap gap-2", className)}>
                <Badge variant="destructive">Unable to load tags</Badge>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {resolvedTagIds.map((tagId) => (
            <TagQuickViewPopover tag={tagMap.get(tagId)}>
                <TagBadge key={tagId} tag={tagMap.get(tagId)} fallbackLabel={tagId}/>
            </TagQuickViewPopover>
            ))}
        </div>
    )
}

function TagBadge({
                      tag,
                      fallbackLabel,
                  }: {
    tag?: TagModel.Tag
    fallbackLabel: string
}) {
    const label = tag?.name?.trim() || tag?.id || fallbackLabel

    return (
        <Badge variant={tag ? "secondary" : "outline"} className="gap-2">
            {tag?.colorHex ? (
                <span className="size-2 rounded-full" style={{backgroundColor: tag.colorHex}}/>
            ) : null}
            {label}
        </Badge>
    )
}
