import {useMemo, useState} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {Check, PlusCircle} from "lucide-react";
import {toast} from "sonner";

import DataTable from "#/components/data-table/data-table.tsx";
import {Button} from "#/components/ui/button.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {QuickToolTip} from "#/components/ui/tooltip.tsx";
import {LeaseDefinitionApiHook} from "#/modules/real-estate/lease-definition/api.hook.ts";
import {LeaseDefinitionModel} from "#/modules/real-estate/lease-definition/model.ts";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {DefinitionCard} from "../../PropertyDetailsPrimitives.tsx";
import {formatDuration, formatMoney} from "../../property-details.utils.ts";
import {PropertyLeaseDefinitionCreateSheet} from "./PropertyLeaseDefinitionCreateSheet.tsx";

export function PropertyDetailsLeaseTab({property}: { property?: PropertyModel.Detailed }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
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
                        <Button size={"xs"} variant={"outline"} onClick={() => setIsCreateOpen(true)} disabled={!property?.id}>
                            <PlusCircle className="size-4"/>
                            new definition
                        </Button>
                    }
                />
            </DefinitionCard>

            <PropertyLeaseDefinitionCreateSheet
                property={property}
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
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
            cell: ({row}) => row.original.name || "Untitled",
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
            accessorKey: "duration",
            header: "Duration",
            cell: ({row}) => formatDuration(row.original.duration, row.original.durationUnit),
        },
        {
            id: "default",
            header: "Default",
            cell: ({row}) =>
                property?.defaultLeaseDefinition?.id === row.original.id ? "Yes" : "No",
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
