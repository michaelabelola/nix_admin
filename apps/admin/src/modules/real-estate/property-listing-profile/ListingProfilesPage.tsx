import {useMemo} from "react"
import {Link} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import DataTable from "#/components/data-table/data-table.tsx"
import type {DataTableRequestBase} from "#/components/data-table/types.ts"
import {Button} from "@suiteonix/ui"
import {ButtonGroup} from "@suiteonix/ui"
import {PropertyListingProfileApiHook} from "@suiteonix/server"
import type {PropertyListingProfileModel} from "@suiteonix/server"

import {createPropertyListingProfileColumns} from "./table.tsx"

type ListingProfileTableRequest = DataTableRequestBase & Pick<
    PropertyListingProfileModel.Query,
    "propertyID" | "isDefault" | "type"
>

export function ListingProfilesPage() {
    const columns = useMemo(() => createPropertyListingProfileColumns(), [])

    return (
        <Page
            header={{
                title: "Listing Profiles",
                description: "Browse listing profile snapshots created across all properties.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/real-estate/properties">
                                View properties
                            </Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <DataTable<PropertyListingProfileModel.PropertyListingProfile, unknown, ListingProfileTableRequest>
                columns={columns}
                from="/admin/real-estate/properties/listing-profiles"
                useQuery={PropertyListingProfileApiHook.useQueryPropertyListingProfiles}
                initialRequest={{
                    page: 0,
                    size: 10,
                }}
                searchPlaceholder="Search listing profiles..."
                emptyMessage="No listing profiles found."
            />
        </Page>
    )
}
