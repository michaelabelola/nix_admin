import type {ColumnDef} from "@tanstack/react-table"

import {DataTable} from "#/components/data-table/data-table.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import {OrganizationRequest} from "#/modules/organization/organization.request.ts"
import type {OrganizationModel} from "#/modules/organization/models/models.ts"

const columns: Array<ColumnDef<OrganizationModel.Organization>> = [
  {
    accessorKey: "name",
    header: "Business",
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
  },
  {
    accessorKey: "industry",
    header: "Industry",
  },
  {
    accessorKey: "isApproved",
    header: "Approval",
    cell: ({row}) =>
      row.original.isApproved ? (
        <Badge variant="default">Approved</Badge>
      ) : (
        <Badge variant="secondary">Pending</Badge>
      ),
  },
  {
    accessorKey: "isSuspended",
    header: "Status",
    cell: ({row}) =>
      row.original.isSuspended ? (
        <Badge variant="destructive">Suspended</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      ),
  },
  {
    accessorKey: "id",
    header: "Organization ID",
  },
]

export function MyBusinessesPage() {
  return (
    <section className="space-y-6 px-4 py-6 lg:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">My Businesses</h1>
        <p className="text-sm text-muted-foreground">
          Review organizations linked to your admin workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            Search, sort, and page through the available organizations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            from="/admin/businesses"
            useQuery={OrganizationRequest.useQueryOrganizations}
            initialRequest={{
              page: 0,
              size: 10,
            }}
            searchPlaceholder="Search businesses..."
            emptyMessage="No organizations found."
          />
        </CardContent>
      </Card>
    </section>
  )
}
