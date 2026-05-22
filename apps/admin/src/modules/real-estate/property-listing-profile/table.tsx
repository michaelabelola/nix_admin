import {Link} from "@tanstack/react-router"
import type {ColumnDef} from "@tanstack/react-table"
import {ArrowRight} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {formatDuration, formatMoney} from "#/modules/real-estate/property/details/property-details.utils.ts"

import type {PropertyListingProfileModel} from "./model.ts"

export function createPropertyListingProfileColumns(): Array<ColumnDef<PropertyListingProfileModel.PropertyListingProfile>> {
    return [
        {
            id: "avatar",
            header: "Avatar",
            cell: ({row}) => (
                <Avatar className="size-8 rounded-md">
                    <AvatarImage
                        src={row.original.avatar || undefined}
                        alt={row.original.name || "Listing profile avatar"}
                        className="object-cover"
                    />
                    <AvatarFallback className="rounded-md">
                        {(row.original.name || "NX").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            ),
        },
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
            meta: {
                sortField: "name",
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
            meta: {
                sortField: "type",
            },
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
            cell: ({row}) => formatListingProfileDefinitionValue(row.original.rent) ?? "Not set",
        },
        {
            id: "lease",
            header: "Lease",
            cell: ({row}) => formatListingProfileDefinitionValue(row.original.lease) ?? "Not set",
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
        {
            id: "action",
            header: "Action",
            cell: ({row}) => (
                <Button size="xs" variant="ghost" asChild>
                    <Link
                        to="/admin/real-estate/properties/listing-profiles/$listingProfileId"
                        params={{
                            listingProfileId: row.original.id,
                        }}
                    >
                        View
                        <ArrowRight className="size-4"/>
                    </Link>
                </Button>
            ),
        },
    ]
}

export function formatListingProfileLocation(location?: PropertyListingProfileModel.Location | null) {
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

export function formatListingProfileDefinitionValue(
    definition?: PropertyListingProfileModel.Rent | PropertyListingProfileModel.Lease | null,
) {
    if (!definition) return null

    const amount = formatMoney(definition.amount)
    const duration = formatDuration(definition.duration, definition.durationUnit)

    if (amount && duration !== "Not set") return `${amount} / ${duration}`
    return amount ?? duration
}
