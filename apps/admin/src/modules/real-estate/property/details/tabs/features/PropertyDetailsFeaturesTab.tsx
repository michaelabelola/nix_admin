import {useMemo} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {PlusCircle} from "lucide-react";

import {DataTable} from "@suiteonix/components";
import {Badge} from "@suiteonix/ui";
import {Button} from "@suiteonix/ui";
import type {PropertyFeatureModel} from "@suiteonix/server";
import {PropertyFeatureApiHook} from "@suiteonix/server";
import type {PropertyModel} from "@suiteonix/server";

import {DefinitionCard} from "../../PropertyDetailsPrimitives.tsx";
import {formatFeatureValue} from "../../property-details.utils.ts";
import {PropertyFeatureCreateSheet} from "./PropertyFeatureCreateSheet.tsx";

export function PropertyDetailsFeaturesTab({
    property,
    createOpen = false,
    onCreateOpenChange = () => undefined,
}: {
    property?: PropertyModel.Detailed
    createOpen?: boolean
    onCreateOpenChange?: (open: boolean) => void
}) {
    const columns = useMemo<Array<ColumnDef<PropertyFeatureModel.PropertyFeature>>>(
        () => createFeatureColumns(),
        [],
    )

    return (
        <>
            <DefinitionCard
                title="Features"
                description="All feature records assigned to this property."
            >
                <DataTable
                    columns={columns}
                    from="/admin/real-estate/properties/$propertyId/features"
                    useQuery={PropertyFeatureApiHook.useQueryPropertyFeatures as any}
                    defaultQueryFields={{
                        propertyId: property?.id,
                    }}
                    initialRequest={{
                        page: 0,
                        size: 10,
                    }}
                    searchPlaceholder="Search features..."
                    emptyMessage="No features found."
                    toolbarActions={
                        <Button
                            size="xs"
                            variant="outline"
                            onClick={() => onCreateOpenChange(true)}
                            disabled={!property?.id}
                        >
                            <PlusCircle className="size-4"/>
                            Add feature
                        </Button>
                    }
                />
            </DefinitionCard>

            <PropertyFeatureCreateSheet
                property={property}
                open={createOpen}
                onOpenChange={onCreateOpenChange}
            />
        </>
    )
}

function createFeatureColumns(): ColumnDef<PropertyFeatureModel.PropertyFeature>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => row.original.name || "Unnamed feature",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({row}) => row.original.description || "No description",
        },
        {
            accessorKey: "format",
            header: "Format",
            cell: ({row}) => (
                <Badge variant="outline">
                    {row.original.format || "UNSET"}
                </Badge>
            ),
        },
        {
            id: "value",
            header: "Value",
            cell: ({row}) => formatFeatureValue(row.original) || "No value",
        },
        {
            accessorKey: "unit",
            header: "Unit",
            cell: ({row}) => row.original.unit || "Not set",
        },
        {
            id: "tags",
            header: "Tags",
            cell: ({row}) => String(row.original.tags.length),
        },
    ]
}
