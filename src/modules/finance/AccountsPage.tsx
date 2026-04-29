import {useMemo} from "react"
import type {ColumnDef} from "@tanstack/react-table"
import {Link} from "@tanstack/react-router"
import {ArrowRight} from "lucide-react"

import Page from "#/components/Page.tsx"
import DataTable from "#/components/data-table/data-table.tsx"
import type {
  DataTableFilterField,
  DataTableRequestBase,
} from "#/components/data-table/types.ts"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {AccountModel} from "#/modules/finance/account/model.ts"
import {AccountRequest} from "#/modules/finance/account/request.hook.ts"
import {
  accountStatusBadgeVariant,
  getAccountDisplayName,
} from "#/modules/finance/finance.utils.tsx"

type AccountsTableRequest = DataTableRequestBase & {
  status?: AccountModel.AccountStatus
  type?: AccountModel.AccountType
  primaryAccount?: boolean
}

const ACCOUNT_FILTER_FIELDS: Array<DataTableFilterField<AccountsTableRequest>> = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: Object.values(AccountModel.AccountStatus).map((status) => ({
      label: status,
      value: status,
    })),
  },
  {
    key: "type",
    label: "Type",
    type: "select",
    options: Object.values(AccountModel.AccountType).map((type) => ({
      label: type,
      value: type,
    })),
  },
  {
    key: "primaryAccount",
    label: "Primary",
    type: "select",
    options: [
      {label: "Primary only", value: "true"},
      {label: "Non-primary only", value: "false"},
    ],
    parseValue: (value) => value === "true",
    serializeValue: (value) => value == null ? "" : String(value),
  },
]

function useAccountsTableQuery(request: AccountsTableRequest) {
  const query: AccountModel.Query = {
    query: request.query,
    page: request.page,
    size: request.size,
    sort: request.sort,
    status: request.status,
    type: request.type,
    primaryAccount: request.primaryAccount,
  }

  return AccountRequest.useQueryAccounts(query)
}

function createAccountColumns(): Array<ColumnDef<AccountModel.Account>> {
  return [
    {
      accessorKey: "name",
      header: "Account",
      cell: ({row}) => (
        <div className="space-y-1">
          <div className="font-medium">{getAccountDisplayName(row.original)}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.accountNumber || row.original.id}
          </div>
        </div>
      ),
      meta: {
        sortField: "name",
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({row}) => row.original.status ? (
        <Badge variant={accountStatusBadgeVariant[row.original.status]}>
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
      accessorKey: "primaryAccount",
      header: "Primary",
      cell: ({row}) => (
        <Badge variant={row.original.primaryAccount ? "success" : "secondary"}>
          {row.original.primaryAccount ? "Primary" : "Secondary"}
        </Badge>
      ),
      meta: {
        sortField: "primaryAccount",
      },
    },
    {
      accessorKey: "providerAccountId",
      header: "Provider Account",
      cell: ({row}) => row.original.providerAccountId || "Not set",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({row}) => (
        <ButtonGroup>
          <Button variant="outline" size="sm" asChild>
            <Link
              to="/admin/finance/accounts/$accountId/dashboard"
              params={{accountId: row.original.id}}
            >
              View
              <ArrowRight className="size-4"/>
            </Link>
          </Button>
        </ButtonGroup>
      ),
    },
  ]
}

export function AccountsPage() {
  const columns = useMemo(() => createAccountColumns(), [])

  return (
    <Page
      header={{
        title: "Accounts",
        description: "Monitor finance accounts, their operational status, and linked providers.",
      }}
    >
      <DataTable<AccountModel.Account, unknown, AccountsTableRequest>
        columns={columns}
        from="/admin/finance/accounts"
        useQuery={useAccountsTableQuery}
        initialRequest={{
          page: 0,
          size: 10,
          sort: [{field: "audit.createdDate", direction: "DESC"}],
        }}
        filterFields={ACCOUNT_FILTER_FIELDS}
        searchPlaceholder="Search accounts..."
        emptyMessage="No accounts found."
      />
    </Page>
  )
}
