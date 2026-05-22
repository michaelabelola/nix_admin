import React, {useMemo} from "react"
import type {ColumnDef} from "@tanstack/react-table"
import {Link} from "@tanstack/react-router"
import {ArrowRight, Eye, PlusCircle, User2Icon} from "lucide-react"

import Page from "#/components/Page.tsx"
import DataTable from "#/components/data-table/data-table.tsx"
import type {
    DataTableFilterField,
    DataTableRequestBase,
} from "#/components/data-table/types.ts"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {CustomerQuickViewPopover} from "#/modules/customer/components/CustomerQuickViewPopover.tsx"
import {
    customerStatusBadgeVariant,
    getCustomerDisplayName,
} from "#/modules/customer/details/customer-details.utils.ts"
import {CustomerModel} from "#/modules/customer/model.ts"
import {CustomerRequest} from "#/modules/customer/request.hook.ts"
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar.tsx";

type CustomerTableRequest = DataTableRequestBase & {
    status?: CustomerModel.CustomerStatus
    type?: CustomerModel.CustomerType
    lifecycleStage?: CustomerModel.CustomerLifecycleStage
}

const CUSTOMER_FILTER_FIELDS: Array<DataTableFilterField<CustomerTableRequest>> = [
    {
        key: "status",
        label: "Status",
        type: "select",
        options: Object.values(CustomerModel.CustomerStatus).map((status) => ({
            label: status,
            value: status,
        })),
    },
    {
        key: "type",
        label: "Type",
        type: "select",
        options: Object.values(CustomerModel.CustomerType).map((type) => ({
            label: type,
            value: type,
        })),
    },
    {
        key: "lifecycleStage",
        label: "Lifecycle stage",
        type: "select",
        options: Object.values(CustomerModel.CustomerLifecycleStage).map((stage) => ({
            label: stage,
            value: stage,
        })),
    },
]

function useCustomerTableQuery(request: CustomerTableRequest) {
    const query: CustomerModel.Query = {
        query: request.query,
        page: request.page,
        size: request.size,
        sort: request.sort,
        status: request.status,
        type: request.type,
        lifecycleStage: request.lifecycleStage,
    }

    return CustomerRequest.useQueryCustomers(query)
}

function createCustomerColumns(): Array<ColumnDef<CustomerModel.Customer>> {
    return [
        {
            accessorKey: "displayName",
            header: "Customer",
            cell: ({row}) => (
                <div className="space-y-1 flex items-center gap-2">
                    <Avatar className={"h-8 w-8 rounded-lg grayscale"}>
                        <AvatarImage src={row?.original?.avatar} className={"object-cover aspect-square border"}/>
                        <AvatarFallback><User2Icon className={"w-4 h-4"}/></AvatarFallback>
                    </Avatar>
                    <div>{getCustomerDisplayName(row.original)}</div>
                    {/*<div className=" text-[0.5rem] text-muted-foreground">ID: {row.original.id}</div>*/}
                </div>
            ),
            meta: {
                sortField: "displayName",
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({row}) => row.original.status ? (
                <Badge variant={customerStatusBadgeVariant[row.original.status]}>
                    {row.original.status}
                </Badge>
            ) : (
                <Badge variant="outline">STATUS_UNSET</Badge>
            ),
            meta: {
                sortField: "status",
            },
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => <Badge variant="outline">{row.original.type || "TYPE_UNSET"}</Badge>,
            meta: {
                sortField: "type",
            },
        },
        {
            accessorKey: "lifecycleStage",
            header: "Stage",
            cell: ({row}) => <Badge variant="secondary">{row.original.lifecycleStage || "STAGE_UNSET"}</Badge>,
            meta: {
                sortField: "lifecycleStage",
            },
        },
        {
            accessorKey: "storageID",
            header: "Storage",
            cell: ({row}) => row.original.storageID != null ? String(row.original.storageID) : "Not set",
        },
        {
            accessorKey: "entityID",
            header: "Entity",
            cell: ({row}) => row.original.entityID,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}) => (
                <ButtonGroup>
                    <CustomerQuickViewPopover customer={row.original}>
                        <Button variant="outline" size="sm">
                            <Eye className="size-4"/>
                            Quick View
                        </Button>
                    </CustomerQuickViewPopover>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/customers/$customerId/summary" params={{customerId: row.original.id}}>
                            View
                            <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </ButtonGroup>
            ),
        },
    ]
}

export function CustomersPage() {
    const columns = useMemo(() => createCustomerColumns(), [])

    return (
        <Page
            header={{
                title: "Customers",
                description: "Review customer records and open the customer detail workspace.",
                actionView: (
                    <ButtonGroup>
                        <Button asChild>
                            <Link to="/admin/customers/create">
                                <PlusCircle className="size-4"/>
                                Create customer
                            </Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <DataTable<CustomerModel.Customer, unknown, CustomerTableRequest>
                columns={columns}
                from="/admin/customers"
                useQuery={useCustomerTableQuery}
                initialRequest={{
                    page: 0,
                    size: 10,
                    sort: [{field: "audit.createdDate", direction: "DESC"}],
                } as any}
                filterFields={CUSTOMER_FILTER_FIELDS}
                searchPlaceholder="Search customers..."
                emptyMessage="No customers found."
            />
        </Page>
    )
}
