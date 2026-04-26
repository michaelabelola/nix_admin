import {useMemo} from "react"
import type {ColumnDef} from "@tanstack/react-table"
import {Link} from "@tanstack/react-router"
import {ArrowRight} from "lucide-react"

import DataTable from "#/components/data-table/data-table.tsx"
import type {
  DataTableFilterField,
  DataTableRequestBase,
} from "#/components/data-table/types.ts"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import type {FileRoutesByTo} from "#/routeTree.gen.ts"
import type {AccountModel} from "#/modules/finance/account/model.ts"
import {
  formatDateTime,
  formatMoney,
  getAccountDisplayName,
  transactionDirectionBadgeVariant,
  transactionStatusBadgeVariant,
} from "#/modules/finance/finance.utils.tsx"
import {TransactionModel} from "#/modules/finance/transaction/model.ts"
import {TransactionRequest} from "#/modules/finance/transaction/request.hook.ts"

export type TransactionsTableRequest = DataTableRequestBase & {
  accountID?: AccountModel.AccountID
  status?: TransactionModel.TransactionStatus
  type?: TransactionModel.TransactionType
  direction?: TransactionModel.TransactionDirection
}

const TRANSACTION_FILTER_FIELDS: Array<DataTableFilterField<TransactionsTableRequest>> = [
  {
    key: "accountID",
    label: "Account ID",
    type: "text",
    placeholder: "Account ID",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: Object.values(TransactionModel.TransactionStatus).map((status) => ({
      label: status,
      value: status,
    })),
  },
  {
    key: "type",
    label: "Type",
    type: "select",
    options: Object.values(TransactionModel.TransactionType).map((type) => ({
      label: type,
      value: type,
    })),
  },
  {
    key: "direction",
    label: "Direction",
    type: "select",
    options: Object.values(TransactionModel.TransactionDirection).map((direction) => ({
      label: direction,
      value: direction,
    })),
  },
]

function useTransactionTableQuery(request: TransactionsTableRequest, fixedAccountId?: AccountModel.AccountID) {
  const query: TransactionModel.Query = {
    query: request.query,
    page: request.page,
    size: request.size,
    sort: request.sort,
    accountID: fixedAccountId ?? request.accountID,
    status: request.status,
    type: request.type,
    direction: request.direction,
  }

  return TransactionRequest.useQueryTransactions(query)
}

function createTransactionColumns(showAccount: boolean): Array<ColumnDef<TransactionModel.Transaction>> {
  const baseColumns: Array<ColumnDef<TransactionModel.Transaction>> = [
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({row}) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.reference || row.original.externalReference || row.original.id}</div>
          <div className="text-sm text-muted-foreground">ID: {row.original.id}</div>
        </div>
      ),
      meta: {
        sortField: "reference",
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
      accessorKey: "status",
      header: "Status",
      cell: ({row}) => row.original.status ? (
        <Badge variant={transactionStatusBadgeVariant[row.original.status]}>
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
      accessorKey: "direction",
      header: "Direction",
      cell: ({row}) => row.original.direction ? (
        <Badge variant={transactionDirectionBadgeVariant[row.original.direction]}>
          {row.original.direction}
        </Badge>
      ) : (
        <Badge variant="outline">UNSET</Badge>
      ),
      meta: {
        sortField: "direction",
      },
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({row}) => (
        <span className={row.original.direction === TransactionModel.TransactionDirection.DEBIT ? "text-warning" : "text-success"}>
          {formatMoney(row.original.amount) || "Not set"}
        </span>
      ),
    },
    {
      accessorKey: "occurredAt",
      header: "Occurred",
      cell: ({row}) => formatDateTime(row.original.occurredAt) || "Not set",
      meta: {
        sortField: "occurredAt",
      },
    },
  ]

  if (showAccount) {
    baseColumns.splice(1, 0, {
      accessorKey: "accountID",
      header: "Account",
      cell: ({row}) => row.original.accountID ? (
        <Button variant="link" size="sm" className="h-auto px-0" asChild>
          <Link
            to="/admin/finance/accounts/$accountId/dashboard"
            params={{accountId: row.original.accountID}}
          >
            {getAccountDisplayName({id: row.original.accountID})}
          </Link>
        </Button>
      ) : (
        "Not set"
      ),
      meta: {
        sortField: "accountID",
      },
    })
  }

  baseColumns.push({
    id: "actions",
    header: "Actions",
    cell: ({row}) =>
      row.original.accountID ? (
        <ButtonGroup>
          <Button variant="outline" size="sm" asChild>
            <Link
              to="/admin/finance/accounts/$accountId/dashboard"
              params={{accountId: row.original.accountID}}
            >
              Account
              <ArrowRight className="size-4"/>
            </Link>
          </Button>
        </ButtonGroup>
      ) : null,
  })

  return baseColumns
}

export function TransactionsTable({
  from,
  fixedAccountId,
  searchPlaceholder = "Search transactions...",
}: {
  from: keyof FileRoutesByTo
  fixedAccountId?: AccountModel.AccountID
  searchPlaceholder?: string
}) {
  const columns = useMemo(
    () => createTransactionColumns(!fixedAccountId),
    [fixedAccountId],
  )
  const filterFields = fixedAccountId
    ? TRANSACTION_FILTER_FIELDS.filter((field) => field.key !== "accountID")
    : TRANSACTION_FILTER_FIELDS

  return (
    <DataTable<TransactionModel.Transaction, unknown, TransactionsTableRequest>
      columns={columns}
      from={from}
      useQuery={(request) => useTransactionTableQuery(request, fixedAccountId)}
      initialRequest={{
        page: 0,
        size: 10,
        sort: [{field: "audit.createdDate", direction: "DESC"}],
      }}
      filterFields={filterFields}
      searchPlaceholder={searchPlaceholder}
      emptyMessage="No transactions found."
    />
  )
}
