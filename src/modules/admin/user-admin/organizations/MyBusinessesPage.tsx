import type {ColumnDef} from "@tanstack/react-table"

import DataTable, {type TableData} from "#/components/data-table/data-table.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import PermissionRequest from "#/modules/permissions/hooks/request.hook.ts";
import {type PermissionModel} from "#/modules/permissions/Models.ts";
import orgApi from "#/modules/organization/apis/Org.api.ts";
import {type OrganizationModel} from "#/modules/organization/models/models.ts";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {buttonVariants} from "#/components/ui/button";
import {EyeIcon, LogIn} from "lucide-react";
import {QuickToolTip, Tooltip, TooltipContent, TooltipTrigger} from "#/components/ui/tooltip.tsx";
import UserCell from "#/modules/user/components/UserCell.tsx";
import {loginApi} from "#/modules/auth/signin/api.tsx";
import {toast} from "sonner";

const signInAs = (request: Parameters<typeof loginApi.proxyLogin>[0]["query"]) => {
    loginApi.proxyLogin({
        query: request
    }).then((response) => {
        console.log(response)
    })
        .catch(error => {
            toast.success(error.message, {});
            // console.log(error)
        })
}

const columns: Array<ColumnDef<TableData<PermissionModel.Permission, OrganizationModel.Organization>>> = [
// const columns: Array<ColumnDef<OrganizationModel.Organization>> = [
    {
        accessorKey: "__computed.name",
        header: "Business",
        cell: ({row: {original}}) => original.__computed?.name
    },
    {
        accessorKey: "__computed.shortName",
        header: "Short Name",
        cell: ({row: {original}}) => original.__computed?.shortName
    },
    {
        accessorKey: "__computed.industry",
        header: "Industry",
        cell: ({row: {original}}) => original.__computed?.industry
    },
    {
        accessorKey: "__computed.isApproved",
        header: "Approval",
        cell: ({row}) =>
            row.original.__computed?.isApproved ? (
                <QuickToolTip content="This organization has been approved by the admin.">
                    <Badge variant="success">Approved</Badge>
                </QuickToolTip>
            ) : (
                <QuickToolTip content="This organization approval is pending.">
                    <Badge variant="warning">Pending</Badge>
                </QuickToolTip>
            ),
    },
    {
        accessorKey: "isSuspended",
        header: "Status",
        cell: ({row}) =>
            row.original.__computed?.isSuspended ? (
                <QuickToolTip content="This organization is suspended and does not have access to the admin workspace.">
                    <Badge variant="destructive">Suspended</Badge>
                </QuickToolTip>
            ) : (
                <QuickToolTip content="This organization is active and has access to the admin workspace.">
                    <Badge variant="success">Active</Badge>
                </QuickToolTip>
            ),
    },
    {
        accessorKey: "__computed.id",
        header: "Organization ID",
        cell: ({row: {original}}) => original.__computed?.id
    },
    {
        accessorKey: "account",
        header: "Account",
        cell: ({row: {original}}) => {
            return <UserCell.CellWithPopover id={original.granteeID}/>
        }
    },
    {
        accessorKey: "action",
        header: "Actions",
        cell: ({row}) => {
            return <ButtonGroup>
                <Tooltip>
                    <TooltipTrigger className={buttonVariants({variant: "outline", size: "sm"})}
                                    onClick={() => {
                                        signInAs({
                                            userId: row.original.granteeID,
                                            orgId: row.original.entityID,

                                        })
                                    }}>
                        <LogIn/>
                    </TooltipTrigger>
                    <TooltipContent>
                        Sign In
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger className={buttonVariants({variant: "outline", size: "sm"})}>
                        <EyeIcon/>
                    </TooltipTrigger>
                    <TooltipContent>
                        View {row.original?.__computed?.shortName}
                    </TooltipContent>
                </Tooltip>
            </ButtonGroup>
        }

    },
]

export function MyBusinessesPage() {
    return (
        <section className="space-y-6 px-4 py-6 lg:px-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">My Organizations</h1>
                <p className="text-sm text-muted-foreground">
                    Review organizations linked to your admin workspace.
                </p>
            </div>

            {/*OrganizationRequest.useQueryOrganizations*/}

            <DataTable
                columns={columns}
                from="/admin/organizations"
                useQuery={PermissionRequest.useQueryProxyLoginAccesses}
                initialRequest={{
                    page: 0,
                    size: 10,
                }}
                searchPlaceholder="Search businesses..."
                emptyMessage="No organizations found."
                useRowQuery={(data) => orgApi.getById(data.entityID)}
            />
        </section>
    )
}
