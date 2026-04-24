import {useMemo, useState} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {Check, PlusCircle} from "lucide-react";
import {toast} from "sonner";

import DataTable from "#/components/data-table/data-table.tsx";
import {Button} from "#/components/ui/button.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {QuickToolTip} from "#/components/ui/tooltip.tsx";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";
import {PricingApiHook} from "#/modules/real-estate/pricing/api.hook.ts";
import type {RealEstatePricingModel} from "#/modules/real-estate/pricing/model.ts";

import {DefinitionCard} from "../../PropertyDetailsPrimitives.tsx";
import {formatMoney} from "../../property-details.utils.ts";
import {PropertyPricingDefinitionCreateSheet} from "./PropertyPricingDefinitionCreateSheet.tsx";

export function PropertyDetailsPricingTab({property}: { property?: PropertyModel.Detailed }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const setDefaultPricing = PricingApiHook.useSetPropertyDefaultPricing(() => {
        toast.success("Default pricing updated.")
    })

    const columns = useMemo<Array<ColumnDef<RealEstatePricingModel.RealEstatePricing>>>(
        () => createPricingDefinitionColumns({
            property,
            isSettingDefault: setDefaultPricing.isPending,
            onMakeDefault: (pricingId) => {
                if (!property?.id) return

                void setDefaultPricing.mutateAsync({
                    propertyId: property.id,
                    pricingId,
                })
            },
        }),
        [property, setDefaultPricing],
    )

    return (
        <>
            <DefinitionCard
                title="Pricing Definitions"
                description="All pricing definitions assigned to this property."
            >
                <DataTable
                    columns={columns}
                    from="/admin/real-estate/properties/$propertyId/pricing"
                    useQuery={PricingApiHook.useQueryPropertyPricings}
                    defaultQueryFields={{
                        propertyId: property?.id,
                    }}
                    initialRequest={{
                        page: 0,
                        size: 10,
                    }}
                    searchPlaceholder="Search Pricing Definitions..."
                    emptyMessage="No Pricing Definitions found."
                    toolbarActions={
                        <Button size={"xs"} variant={"outline"} onClick={() => setIsCreateOpen(true)} disabled={!property?.id}>
                            <PlusCircle className="size-4"/>
                            new definition
                        </Button>
                    }
                />
            </DefinitionCard>

            <PropertyPricingDefinitionCreateSheet
                property={property}
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
            />
        </>
    )
}

function createPricingDefinitionColumns({
    property,
    isSettingDefault,
    onMakeDefault,
}: {
    property?: PropertyModel.Detailed
    isSettingDefault: boolean
    onMakeDefault: (pricingId: RealEstatePricingModel.PriceID) => void
}): ColumnDef<RealEstatePricingModel.RealEstatePricing>[] {
    return [
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({row}) => formatMoney(row.original.amount) ?? "Not set",
        },
        {
            accessorKey: "id",
            header: "Pricing ID",
            cell: ({row}) => String(row.original.id),
        },
        {
            accessorKey: "entityID",
            header: "Entity ID",
            cell: ({row}) => row.original.entityID,
        },
        {
            id: "default",
            header: "Default",
            cell: ({row}) =>
                property?.defaultPriceDefinition?.id === row.original.id ? "Yes" : "No",
        },
        {
            id: "action",
            header: "Action",
            cell: ({row}) => {
                const isDefault = property?.defaultPriceDefinition?.id === row.original.id

                return (
                    <ButtonGroup>
                        <QuickToolTip
                            asChild
                            content={isDefault ? "Current default pricing definition" : "Make default pricing definition"}
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
