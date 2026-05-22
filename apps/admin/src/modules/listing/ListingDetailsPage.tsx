import {Link} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {EmptyState} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"

import {ListingDetailsTabs} from "./details/ListingDetailsTabs.tsx"
import type {ListingModel} from "./model.ts"
import {ListingRequest} from "./request.hook.ts"

export function ListingDetailsPage({listingId}: { listingId: ListingModel.ListingID }) {
    const query = ListingRequest.useGetListing(listingId)
    const data = query.data

    return (
        <Page
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            loading={{
                title: "Loading listing",
                description: "Fetching listing details.",
            }}
            header={{
                title: data?.title || "Listing",
                description: data?.description || "Review listing details and attached tags.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/listings">
                                Back to listings
                            </Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            {!data ? (
                <EmptyState
                    title="Listing not found"
                    description="The requested listing could not be loaded."
                />
            ) : (
                <ListingDetailsTabs listing={data}/>
            )}
        </Page>
    )
}
