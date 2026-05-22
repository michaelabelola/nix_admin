import {useMemo} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {PlusCircle} from "lucide-react";
import {toast} from "sonner";

import {DataTable} from "@suiteonix/components";
import {Button} from "@suiteonix/ui";
import type {PropertyModel} from "@suiteonix/server";
import {PricingApiHook} from "@suiteonix/server";
import type {RealEstatePricingModel} from "@suiteonix/server";

import {DefinitionCard} from "../../PropertyDetailsPrimitives.tsx";
import {formatMoney} from "../../property-details.utils.ts";
import {PropertyPricingDefinitionCreateSheet} from "./PropertyPricingDefinitionCreateSheet.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@suiteonix/ui";
import {IconDotsVertical, IconShare3, IconTrash} from "@tabler/icons-react";
import {Badge} from "@suiteonix/ui";

export function PropertyDetailsPricingTab({
    property,
    createOpen = false,
    onCreateOpenChange = () => undefined,
}: {
    property?: PropertyModel.Detailed
    createOpen?: boolean
    onCreateOpenChange?: (open: boolean) => void
}) {
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
                        <Button size={"xs"} variant={"outline"} onClick={() => onCreateOpenChange(true)}
                                disabled={!property?.id}>
                            <PlusCircle className="size-4"/>
                            Add
                        </Button>
                    }
                />
            </DefinitionCard>

            <PropertyPricingDefinitionCreateSheet
                property={property}
                open={createOpen}
                onOpenChange={onCreateOpenChange}
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
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => (
                <span>
                    {row.original.name || "Untitled"}
                    {property?.defaultPriceDefinition?.id === row.original.id && (
                        <Badge variant="default" className="ml-2">Default</Badge>
                    )}
                </span>
            ),
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
            accessorKey: "id",
            header: "ID",
            cell: ({row}) => String(row.original.id),
        },
        {
            id: "action",
            header: "Action",
            cell: ({row}) => {
                const isDefault = property?.defaultPriceDefinition?.id === row.original.id

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-xs"
                            >
                                <IconDotsVertical className="size-4"/>
                            </Button>
                            {/*<SidebarMenuAction*/}
                            {/*    showOnHover*/}
                            {/*    className="rounded-sm data-[state=open]:bg-accent"*/}
                            {/*>*/}
                            {/*    <IconDots/>*/}
                            {/*    <span className="sr-only">More</span>*/}
                            {/*</SidebarMenuAction>*/}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-24 rounded-lg">
                            <DropdownMenuItem
                                disabled={isDefault || isSettingDefault || !property?.id}
                                onClick={() => {
                                    if (isDefault) return
                                    onMakeDefault(row.original.id)
                                }}>
                                {/*<IconFolder/>*/}
                                <span className={"text-nowrap"}>Set As Default</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconShare3/>
                                <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem variant="destructive">
                                <IconTrash/>
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
}
