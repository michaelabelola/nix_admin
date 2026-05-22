import {useMemo} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {Check, PlusCircle} from "lucide-react";
import {toast} from "sonner";

import DataTable from "#/components/data-table/data-table.tsx";
import {Button} from "@suiteonix/ui";
import {ButtonGroup} from "@suiteonix/ui";
import {QuickToolTip} from "@suiteonix/ui";
import {LeaseDefinitionApiHook} from "@suiteonix/server";
import {LeaseDefinitionModel} from "@suiteonix/server";
import type {PropertyModel} from "@suiteonix/server";

import {DefinitionCard} from "../../PropertyDetailsPrimitives.tsx";
import {formatDuration, formatMoney} from "../../property-details.utils.ts";
import {PropertyLeaseDefinitionCreateSheet} from "./PropertyLeaseDefinitionCreateSheet.tsx";
import {Badge} from "@suiteonix/ui";

export function PropertyDetailsLeaseTab({
                                            property,
                                            createOpen = false,
                                            onCreateOpenChange = () => undefined,
                                        }: {
    property?: PropertyModel.Detailed
    createOpen?: boolean
    onCreateOpenChange?: (open: boolean) => void
}) {
    const setDefaultLease = LeaseDefinitionApiHook.useSetPropertyDefaultLease(() => {
        toast.success("Default lease definition updated.")
    })

    const columns = useMemo<Array<ColumnDef<LeaseDefinitionModel.LeaseDefinition>>>(
        () => createLeaseDefinitionColumns({
            property,
            isSettingDefault: setDefaultLease.isPending,
            onMakeDefault: (leaseDefinitionId) => {
                if (!property?.id) return

                void setDefaultLease.mutateAsync({
                    propertyId: property.id,
                    leaseDefinitionId,
                })
            },
        }),
        [property, setDefaultLease],
    )

    return (
        <>
            <DefinitionCard
                title="Lease Definitions"
                description="All lease definitions assigned to this property."
            >
                <DataTable
                    columns={columns}
                    from="/admin/real-estate/properties/$propertyId/lease"
                    useQuery={LeaseDefinitionApiHook.useQueryPropertyLeases}
                    defaultQueryFields={{
                        propertyId: property?.id,
                    }}
                    initialRequest={{
                        page: 0,
                        size: 10,
                    }}
                    searchPlaceholder="Search Lease Definitions..."
                    emptyMessage="No Lease Definitions found."
                    toolbarActions={
                        <Button size={"xs"} variant={"outline"} onClick={() => onCreateOpenChange(true)}
                                disabled={!property?.id}>
                            <PlusCircle className="size-4"/>
                            new definition
                        </Button>
                    }
                />
            </DefinitionCard>

            <PropertyLeaseDefinitionCreateSheet
                property={property}
                open={createOpen}
                onOpenChange={onCreateOpenChange}
            />
        </>
    )
}

function createLeaseDefinitionColumns({
                                          property,
                                          isSettingDefault,
                                          onMakeDefault,
                                      }: {
    property?: PropertyModel.Detailed
    isSettingDefault: boolean
    onMakeDefault: (leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) => void
}): ColumnDef<LeaseDefinitionModel.LeaseDefinition>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => {
                return <span>
                {row.original.name || "Untitled"}
                    {property?.defaultLeaseDefinition?.id === row.original.id &&
                        <Badge variant={"default"} className={"ml-2"}>Default</Badge>}
                </span>
            },
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
                const isDefault = property?.defaultLeaseDefinition?.id === row.original.id

                return (
                    <ButtonGroup>
                        <QuickToolTip
                            asChild
                            content={isDefault ? "Current default lease definition" : "Make default lease definition"}
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
