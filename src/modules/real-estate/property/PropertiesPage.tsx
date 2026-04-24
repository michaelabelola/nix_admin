import {useMemo} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {Link} from "@tanstack/react-router";
import {ArrowRight, MapPin, PlusCircle} from "lucide-react";

import Page from "#/components/Page.tsx";
import DataTable from "#/components/data-table/data-table.tsx";
import type {DataTableRequestBase} from "#/components/data-table/types.ts";
import {Button} from "#/components/ui/button.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {Badge} from "#/components/ui/badge.tsx";
import type {PageRequest} from "#/models/PagedModel.ts";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {formatLocation} from "./details/property-details.utils.ts";

type PropertyTableRequest = DataTableRequestBase

function usePropertyTableQuery(request: PropertyTableRequest) {
    const query: PageRequest = {
        page: request.page,
        size: request.size,
        sort: request.sort,
    }

    return PropertyApiHook.useQueryProperties(query)
}

function createPropertyColumns(): Array<ColumnDef<PropertyModel.Property>> {
    return [
        {
            accessorKey: "name",
            header: "Property",
            cell: ({row}) => (
                <div className="space-y-1">
                    <div className="font-medium">{row.original.name || "Untitled property"}</div>
                    <div className="text-sm text-muted-foreground">{row.original.description || "No description"}</div>
                </div>
            ),
            meta: {
                sortField: "name",
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
            accessorKey: "lifecycleStage",
            header: "Stage",
            cell: ({row}) => (
                <Badge variant="secondary">
                    {row.original.lifecycleStage || "STAGE_UNSET"}
                </Badge>
            ),
            meta: {
                sortField: "lifecycleStage",
            },
        },
        {
            id: "location",
            header: "Location",
            cell: ({row}) => (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0"/>
                    <span>{formatLocation(row.original.location) || "No location"}</span>
                </div>
            ),
        },
        {
            id: "tags",
            header: "Tags",
            cell: ({row}) => String(row.original.tags.length),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}) => (
                <ButtonGroup>
                    <Button variant="outline" size="sm" asChild>
                        <Link
                            to="/admin/real-estate/properties/$propertyId/summary"
                            params={{propertyId: row.original.id}}
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

export function PropertiesPage() {
    const columns = useMemo(() => createPropertyColumns(), [])

    return (
        <Page
            header={{
                title: "Properties",
                description: "Review registered properties and open a property detail workspace.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/real-estate/properties/locations">
                                View locations
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link to="/admin/real-estate/properties/onboard">
                                <PlusCircle className="size-4"/>
                                Onboard property
                            </Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <DataTable<PropertyModel.Property, unknown, PropertyTableRequest>
                columns={columns}
                from="/admin/real-estate/properties"
                useQuery={usePropertyTableQuery}
                initialRequest={{
                    page: 0,
                    size: 10,
                }}
                searchPlaceholder="Search properties..."
                emptyMessage="No properties found."
            />
        </Page>
    )
}
