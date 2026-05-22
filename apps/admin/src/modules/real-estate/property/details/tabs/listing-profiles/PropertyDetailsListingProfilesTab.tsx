import {useMemo} from "react"
import {useNavigate} from "@tanstack/react-router"
import {PlusCircle} from "lucide-react"

import DataTable from "#/components/data-table/data-table.tsx"
import {Button} from "#/components/ui/button.tsx"
import {DefinitionCard} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"
import {PropertyListingProfileApiHook} from "@suiteonix/server"
import {createPropertyListingProfileColumns} from "#/modules/real-estate/property-listing-profile/table.tsx"
import type {PropertyModel} from "@suiteonix/server"

export function PropertyDetailsListingProfilesTab({
    property,
}: {
    property?: PropertyModel.Detailed
}) {
    const navigate = useNavigate()
    const columns = useMemo(() => createPropertyListingProfileColumns(), [])

    return (
        <DefinitionCard
            title="Listing Profiles"
            description="Listing profile snapshots generated for this property."
        >
            <DataTable
                columns={columns}
                from="/admin/real-estate/properties/$propertyId/listing-profiles"
                useQuery={PropertyListingProfileApiHook.useQueryPropertyListingProfiles}
                defaultQueryFields={{
                    propertyID: property?.id,
                }}
                initialRequest={{
                    page: 0,
                    size: 10,
                }}
                searchPlaceholder="Search listing profiles..."
                emptyMessage="No listing profiles found."
                toolbarActions={
                    <Button
                        size="xs"
                        variant="success"
                        disabled={!property?.id}
                        onClick={() => {
                            if (!property?.id) return

                            void navigate({
                                to: "/admin/real-estate/properties/$propertyId/listing-profiles/create",
                                params: {propertyId: property.id},
                            })
                        }}
                    >
                        <PlusCircle className="size-4"/>
                        Create Profile
                    </Button>
                }
            />
        </DefinitionCard>
    )
}
