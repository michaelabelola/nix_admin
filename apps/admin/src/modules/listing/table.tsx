import {Link} from "@tanstack/react-router"
import type {ColumnDef} from "@tanstack/react-table"
import {ArrowRight} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"

import {ListingModel} from "@suiteonix/server"

export function getListingStatusVariant(status?: string | null) {
    if (status === ListingModel.ListingStatus.LIVE) return "success"
    if (status === ListingModel.ListingStatus.INACTIVE) return "warning"
    return "outline"
}

export function createListingColumns(): Array<ColumnDef<ListingModel.Listing>> {
    return [
        {
            accessorKey: "title",
            header: "Listing",
            cell: ({row}) => (
                <div className="space-y-1">
                    <div className="font-medium">{row.original.title || "Untitled listing"}</div>
                    <div className="line-clamp-2 text-sm text-muted-foreground">
                        {row.original.description || "No description"}
                    </div>
                </div>
            ),
            meta: {
                sortField: "title",
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({row}) => (
                <Badge variant={getListingStatusVariant(row.original.status)}>
                    {row.original.status || "STATUS_UNSET"}
                </Badge>
            ),
            meta: {
                sortField: "status",
            },
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => (
                <Badge variant="outline">
                    {row.original.type || "TYPE_UNSET"}
                </Badge>
            ),
            meta: {
                sortField: "type",
            },
        },
        {
            accessorKey: "module",
            header: "Module",
            cell: ({row}) => row.original.module || "Not set",
            meta: {
                sortField: "module",
            },
        },
        // {
        //     id: "tags",
        //     header: "Tags",
        //     cell: ({row}) => String(row.original.tags?.length ?? 0),
        // },
        // {
        //     accessorKey: "entityID",
        //     header: "Entity",
        //     cell: ({row}) => row.original.entityID,
        // },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}) => (
                <ButtonGroup>
                    <Button variant="outline" size="sm" asChild>
                        <Link
                            to="/admin/listings/$listingId"
                            params={{listingId: row.original.id}}
                        >
                            View
                            <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </ButtonGroup>
            ),
        },
    ]
}
