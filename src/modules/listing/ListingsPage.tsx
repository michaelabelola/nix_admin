import {useMemo} from "react"
import {Link} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import DataTable from "#/components/data-table/data-table.tsx"
import type {DataTableRequestBase} from "#/components/data-table/types.ts"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {ListingRequest} from "#/modules/listing/request.hook.ts"

import type {ListingModel} from "./model.ts"
import {createListingColumns} from "./table.tsx"

type ListingTableRequest = DataTableRequestBase

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
                            <Link to="/admin/real-estate/properties/listing-profiles">
                                Create Listing
                            </Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <DataTable<ListingModel.Listing, unknown, ListingTableRequest>
                columns={columns}
                from="/admin/real-estate/listings"
                useQuery={useListingTableQuery}
                initialRequest={{
                    page: 0,
                    size: 10,
                    sort: [{field: "audit.createdDate", direction: "DESC"}],
                }}
                searchPlaceholder="Search listings..."
                emptyMessage="No listings found."
            />
        </Page>
    )
}
