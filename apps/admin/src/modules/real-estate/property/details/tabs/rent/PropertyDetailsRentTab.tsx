import {useMemo} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {Check, PlusCircle} from "lucide-react";
import {toast} from "sonner";

import DataTable from "#/components/data-table/data-table.tsx";
import {Button} from "@suiteonix/ui";
import {ButtonGroup} from "@suiteonix/ui";
import {QuickToolTip} from "@suiteonix/ui";
import type {PropertyModel} from "@suiteonix/server";
import {RentDefinitionRequest} from "@suiteonix/server";
import {RentDefinitionModel} from "@suiteonix/server";

import {DefinitionCard} from "../../PropertyDetailsPrimitives.tsx";
import {formatDuration, formatMoney} from "../../property-details.utils.ts";
import {PropertyRentDefinitionCreateSheet} from "./PropertyRentDefinitionCreateSheet.tsx";
import {Badge} from "@suiteonix/ui";

export function PropertyDetailsRentTab({
                                           property,
                                           createOpen = false,
                                           onCreateOpenChange = () => undefined,
                                       }: {
    property?: PropertyModel.Detailed
    createOpen?: boolean
    onCreateOpenChange?: (open: boolean) => void
}) {
    const setDefaultRent = RentDefinitionRequest.useSetPropertyDefaultRent(() => {
        toast.success("Default rent definition updated.")
    })

    const columns = useMemo<Array<ColumnDef<RentDefinitionModel.RentDefinition>>>(
        () => createRentDefinitionColumns({
            property,
            isSettingDefault: setDefaultRent.isPending,
            onMakeDefault: (rentDefinitionId) => {
                if (!property?.id) return

                void setDefaultRent.mutateAsync({
                    propertyId: property.id,
                    rentDefinitionId,
                })
            },
        }),
        [property, setDefaultRent],
    )

    return (
        <>
            <DefinitionCard
                title="Rent Definitions"
                description="All rent definitions assigned to this property."
            >
                <DataTable
                    columns={columns}
                    from="/admin/real-estate/properties/$propertyId/rent"
                    useQuery={RentDefinitionRequest.useQueryPropertyRents}
                    defaultQueryFields={{
                        propertyId: property?.id,
                    }}
                    initialRequest={{
                        page: 0,
                        size: 10,
                    }}
                    searchPlaceholder="Search Rent Definitions..."
                    emptyMessage="No Rent Definitions found."
                    toolbarActions={
                        <Button size={"xs"} variant={"outline"} onClick={() => onCreateOpenChange(true)}
                                disabled={!property?.id}>
                            <PlusCircle className="size-4"/>
                            new definition
                        </Button>
                    }
                />
            </DefinitionCard>

            <PropertyRentDefinitionCreateSheet
                property={property}
                open={createOpen}
                onOpenChange={onCreateOpenChange}
            />
        </>
    )
}

function createRentDefinitionColumns({
                                         property,
                                         isSettingDefault,
                                         onMakeDefault,
                                     }: {
    property?: PropertyModel.Detailed
    isSettingDefault: boolean
    onMakeDefault: (rentDefinitionId: RentDefinitionModel.RentDefinitionID) => void
}): ColumnDef<RentDefinitionModel.RentDefinition>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) =>
                <span>
                    {row.original.name || "Untitled"}
                    {property?.defaultRentDefinition?.id === row.original.id &&
                        <Badge variant={"default"} className={"ml-2"}>Default</Badge>}
                </span>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({row}) => row.original.description || "No description",
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({row}) => formatMoney(row.original.amount) ?? "Not set",
        },
        {
            accessorKey: "negotiable",
            header: "Negotiable",
            cell: ({row}) => row.original.negotiable ? "Yes" : "No",
        },
        {
            accessorKey: "duration",
            header: "Duration",
            cell: ({row}) => formatDuration(row.original.duration, row.original.durationUnit),
        },
        {
            id: "action",
            header: "Action",
            cell: ({row}) => {
                const isDefault = property?.defaultRentDefinition?.id === row.original.id

                return (
                    <ButtonGroup>
                        <QuickToolTip
                            asChild
                            content={isDefault ? "Current default rent definition" : "Make default rent definition"}
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={isDefault || isSettingDefault || !property?.id}
                                onClick={() => {
                                    if (isDefault) return
                                    onMakeDefault(row.original.id)
                                }}
                            >
                                <Check className="size-4"/>
                            </Button>
                        </QuickToolTip>
                    </ButtonGroup>
                )
            },
        },
    ]
}
