import {Link} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import {Button} from "@suiteonix/ui"
import {ButtonGroup} from "@suiteonix/ui"
import {EmptyState} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"

import {ListingDetailsTabs} from "./details/ListingDetailsTabs.tsx"
import type {ListingModel} from "@suiteonix/server"
import {ListingRequest} from "@suiteonix/server"

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
