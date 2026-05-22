import {RefreshCwIcon} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {
    DefinitionCard,
    EmptyState,
} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"

import type {ListingModel} from "@suiteonix/server"
import {ListingQuerierRequest} from "@suiteonix/server"
import {ListingPropertyCard} from "./ListingPropertyCard.tsx"

export function ListingListedItemsTab({listingId}: { listingId: ListingModel.ListingID }) {
    const query = ListingQuerierRequest.useInfiniteQueryListingProperties(listingId, {
        page: 0,
        size: 12,
    })
    const items = query.data.content

    return (
        <DefinitionCard
            title="Listed Items"
            description="Real estate property listing profiles currently attached to this listing."
        >
            <div className="mb-4 flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={query.isFetching}
                    onClick={() => void query.refetch()}
                >
                    <RefreshCwIcon className="size-4"/>
                    Refresh
                </Button>
            </div>
            {query.isLoading ? (
                <EmptyState
                    title="Loading listed items"
                    description="Fetching real estate properties in this listing."
                />
            ) : items.length === 0 ? (
                <EmptyState
                    title="No listed items"
                    description="This listing does not have any real estate property items yet."
                />
            ) : (
                <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {items.map((item) => (
                            <ListingPropertyCard key={item.id} item={item}/>
                        ))}
                    </div>

                    {query.data.hasNext ? (
                        <div className="flex justify-center border-t pt-5">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={query.isFetchingNextPage}
                                onClick={() => void query.fetchNextPage()}
                            >
                                {query.isFetchingNextPage ? "Loading..." : "Load more"}
                            </Button>
                        </div>
                    ) : null}
                </div>
            )}
        </DefinitionCard>
    )
}
