import {useMemo} from "react"
import {Link} from "@tanstack/react-router"

import {Page} from "@suiteonix/components"
import {DataTable} from "@suiteonix/components"
import type {DataTableRequestBase} from "@suiteonix/components"
import {Button} from "@suiteonix/ui"
import {ButtonGroup} from "@suiteonix/ui"
import {ListingRequest} from "@suiteonix/server"

import type {ListingModel} from "@suiteonix/server"
import {createListingColumns} from "./table.tsx"

type ListingTableRequest = DataTableRequestBase

const initialListingRequest = {
    page: 0,
    size: 10,
    sort: [{field: "audit.createdDate", direction: "DESC"}],
} as unknown as Partial<ListingTableRequest>

function useListingTableQuery(request: ListingTableRequest) {
    const query: ListingModel.Query = {
        query: request.query,
        page: request.page,
        size: request.size,
        sort: request.sort,
    }

    return ListingRequest.useQueryListings(query)
}

export function ListingsPage() {
    const columns = useMemo(() => createListingColumns(), [])

    return (
        <Page
            header={{
                title: "Listings",
                description: "Review published and inactive listing records in the current workspace.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/listings/create">
                                Create Listing
                            </Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <DataTable<ListingModel.Listing, unknown, ListingTableRequest>
                columns={columns}
                from="/admin/listings"
                useQuery={useListingTableQuery}
                initialRequest={initialListingRequest}
                searchPlaceholder="Search listings..."
                emptyMessage="No listings found."
            />
        </Page>
    )
}
