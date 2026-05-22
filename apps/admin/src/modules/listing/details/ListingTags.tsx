import {Badge} from "#/components/ui/badge.tsx"
import {EmptyState} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"
import {TagRequest} from "@suiteonix/server"

import type {ListingModel} from "@suiteonix/server"

export function ListingTags({listing}: { listing: ListingModel.Detailed }) {
    const tagIds = listing.tags ?? []
    const tagsQuery = TagRequest.useGetTagsBatch(tagIds)
    const tags = tagsQuery.data ?? []

    if (tagIds.length === 0) {
        return (
            <EmptyState
                title="No tags"
                description="This listing does not have any assigned tags."
            />
        )
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tagIds.map((tagId) => {
                const tag = tags.find((item) => item.id === tagId)

                return (
                    <Badge key={tagId} variant="outline">
                        {tag?.name || tagId}
                    </Badge>
                )
            })}
        </div>
    )
}
