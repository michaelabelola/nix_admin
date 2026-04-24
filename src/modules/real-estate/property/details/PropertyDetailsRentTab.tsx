import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {DefinitionCard} from "./PropertyDetailsPrimitives.tsx";
import {formatMoney} from "./property-details.utils.ts";
import {RentDefinitionRequest} from "#/modules/real-estate/rent-definition/api.hook.ts";
import DataTable from "#/components/data-table/data-table.tsx";
import type {ColumnDef} from "@tanstack/react-table";
import {RentDefinitionModel} from "#/modules/real-estate/rent-definition/model.ts";
import {QuickToolTip} from "#/components/ui/tooltip.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {Button, buttonVariants} from "#/components/ui/button.tsx";
import {Check} from "lucide-react";

const columns: ColumnDef<RentDefinitionModel.RentDefinition>[] = [
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({row}) => {
            return (formatMoney(row.original.amount))
        }
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({row}) => {
            return (`${row.original.duration} ${row.original.durationUnit}`)
        }
    },
    {
        accessorKey: "isDefault",
        header: "Default",
        cell: ({row}) => {
            return (`${row.original.duration} ${row.original.durationUnit}`)
        }
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: () => {
            return (
                <ButtonGroup>
                    <QuickToolTip asChild content="Edit Rent Definition">
                        <Button className={buttonVariants({variant: "outline"})}>
                            <Check className="w-4 h-4"/>
                        </Button>
                    </QuickToolTip>
                </ButtonGroup>
            )
        }
    }
]

export function PropertyDetailsRentTab({property}: { property?: PropertyModel.Detailed }) {

    return (
        <DefinitionCard
            title="Rent Definitions"
            description="All rent definitions assigned to this property.">

            <DataTable
                columns={columns}
                from="/admin/real-estate/properties/$propertyId/details"
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
                // useRowQuery={(data) => orgApi.getById(data.entityID)}
            />
        </DefinitionCard>
    )
}
