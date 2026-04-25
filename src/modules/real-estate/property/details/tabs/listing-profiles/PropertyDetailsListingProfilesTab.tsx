import {useMemo} from "react"
import {useNavigate} from "@tanstack/react-router"
import type {ColumnDef} from "@tanstack/react-table"
import {PlusCircle} from "lucide-react"

import DataTable from "#/components/data-table/data-table.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {DefinitionCard} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"
import {formatDuration, formatMoney} from "#/modules/real-estate/property/details/property-details.utils.ts"
import type {PropertyListingProfileModel} from "#/modules/real-estate/property-listing-profile/model.ts"
import {PropertyListingProfileApiHook} from "#/modules/real-estate/property-listing-profile/api.hook.ts"
import type {PropertyModel} from "#/modules/real-estate/property/model.ts"

export function PropertyDetailsListingProfilesTab({
    property,
}: {
    property?: PropertyModel.Detailed
}) {
    const navigate = useNavigate()
    const columns = useMemo<Array<ColumnDef<PropertyListingProfileModel.PropertyListingProfile>>>(
        () => createListingProfileColumns(),
        [],
    )

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
                        variant="outline"
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
                        Create Listing Profile
                    </Button>
                }
            />
        </DefinitionCard>
    )
}

function createListingProfileColumns(): Array<ColumnDef<PropertyListingProfileModel.PropertyListingProfile>> {
    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => {
                const isDefault = Boolean(row.original.isDefault)

                return (
                    <span>
                        {row.original.name || "Untitled profile"}
                        {isDefault ? <Badge className="ml-2">Default</Badge> : null}
                    </span>
                )
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({row}) => row.original.description || "No description",
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => row.original.type || "Not set",
        },
        {
            id: "location",
            header: "Location",
            cell: ({row}) => formatListingProfileLocation(row.original.location),
        },
        {
            id: "price",
            header: "Price",
            cell: ({row}) => formatMoney(row.original.price?.amount) ?? "Not set",
        },
        {
            id: "rent",
            header: "Rent",
            cell: ({row}) => formatDefinitionValue(row.original.rent) ?? "Not set",
        },
        {
            id: "lease",
            header: "Lease",
            cell: ({row}) => formatDefinitionValue(row.original.lease) ?? "Not set",
        },
        {
            id: "tags",
            header: "Tags",
            cell: ({row}) => String(row.original.tags.length),
        },
        {
            id: "features",
            header: "Features",
            cell: ({row}) => String(row.original.features.length),
        },
    ]
}

function formatListingProfileLocation(location?: PropertyListingProfileModel.Location | null) {
    if (!location) return "Not set"

    const parts = [
        location.line1,
        location.line2,
        location.city,
        location.state,
        location.postalCode,
        location.country,
    ].filter(Boolean)

    if (parts.length > 0) {
        return parts.join(", ")
    }

    const secondaryParts = [
        location.building,
        location.unit,
        location.apartment,
    ].filter(Boolean)

    return secondaryParts.join(", ") || "Not set"
}

function formatDefinitionValue(
    definition?: PropertyListingProfileModel.Rent | PropertyListingProfileModel.Lease | null,
) {
    if (!definition) return null

    const amount = formatMoney(definition.amount)
    const duration = formatDuration(definition.duration, definition.durationUnit)

    if (amount && duration !== "Not set") return `${amount} / ${duration}`
    return amount ?? duration
}
