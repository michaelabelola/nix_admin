import type {ColumnDef} from "@tanstack/react-table"
import {EyeIcon, LogIn} from "lucide-react"

import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {buttonVariants} from "#/components/ui/button.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {
  QuickToolTip,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip.tsx"
import UserCell from "#/modules/user/components/UserCell.tsx"

import type {PermissionRow} from "./my-businesses.types.ts"

export function createMyBusinessesColumns({
  onSignInRequest,
}: {
  onSignInRequest: (row: PermissionRow) => void
}): Array<ColumnDef<PermissionRow>> {
  return [
    {
      accessorKey: "__computed.name",
      header: "Business",
      cell: ({row: {original}}) => original.__computed?.name,
    },
    {
      accessorKey: "__computed.shortName",
      header: "Short Name",
      cell: ({row: {original}}) => original.__computed?.shortName,
    },
    {
      accessorKey: "__computed.industry",
      header: "Industry",
      cell: ({row: {original}}) => original.__computed?.industry,
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
      cell: ({row: {original}}) => original.__computed?.id,
    },
    {
      accessorKey: "account",
      header: "Account",
      cell: ({row: {original}}) => <UserCell.CellWithPopover id={original.actions[0]} />,
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({row}) => (
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger
              className={buttonVariants({variant: "outline", size: "sm"})}
              onClick={() => onSignInRequest(row.original)}
            >
              <LogIn />
            </TooltipTrigger>
            <TooltipContent>Sign In</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger className={buttonVariants({variant: "outline", size: "sm"})}>
              <EyeIcon />
            </TooltipTrigger>
            <TooltipContent>
              View {row.original?.__computed?.shortName}
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>
      ),
    },
  ]
}
