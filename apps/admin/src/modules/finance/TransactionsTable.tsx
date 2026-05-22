import {useMemo} from "react"
import type {ColumnDef} from "@tanstack/react-table"
import {Link} from "@tanstack/react-router"
import {ArrowRight} from "lucide-react"

import {DataTable} from "@suiteonix/components"
import type {
  DataTableFilterField,
  DataTableRequestBase,
} from "@suiteonix/components"
import {Badge} from "@suiteonix/ui"
import {Button} from "@suiteonix/ui"
import {ButtonGroup} from "@suiteonix/ui"
import type {FileRoutesByTo} from "#/routeTree.gen.ts"
import type {AccountModel} from "@suiteonix/server"
import {
  formatDateTime,
  formatMoney,
  getAccountDisplayName,
  getTransactionAccount,
  getTransactionDirection,
  transactionDirectionBadgeVariant,
  transactionStatusBadgeVariant,
} from "#/modules/finance/finance.utils.tsx"
import {TransactionModel} from "@suiteonix/server"
import {TransactionRequest} from "@suiteonix/server"

export type TransactionsTableRequest = DataTableRequestBase & {
  accountID?: AccountModel.AccountID
  status?: TransactionModel.TransactionStatus
  type?: TransactionModel.TransactionType
  direction?: TransactionModel.EntryType
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
    options: Object.values(TransactionModel.EntryType).map((direction) => ({
      label: direction,
      value: direction,
    })),
  },
]

const TRANSACTIONS_INITIAL_REQUEST = {
  page: 0,
  size: 10,
  sort: [{field: "audit.createdDate", direction: "DESC"}],
} as Partial<TransactionsTableRequest>

function useTransactionTableQuery(request: TransactionsTableRequest, fixedAccountId?: AccountModel.AccountID) {
  const query: TransactionModel.Query = {
    query: request.query,
    page: request.page,
    size: request.size,
    sort: request.sort,
    status: request.status,
    type: request.type,
    entries: [
      {
        account: fixedAccountId || request.accountID ? {id: fixedAccountId ?? request.accountID} : undefined,
        type: request.direction,
      },
    ].filter((entry) => entry.account || entry.type),
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
      id: "direction",
      header: "Direction",
      cell: ({row}) => getTransactionDirection(row.original) ? (
        <Badge variant={transactionDirectionBadgeVariant[getTransactionDirection(row.original)!]}>
          {getTransactionDirection(row.original)}
        </Badge>
      ) : (
        <Badge variant="outline">UNSET</Badge>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({row}) => (
        <span className={getTransactionDirection(row.original) === TransactionModel.EntryType.DEBIT ? "text-warning" : "text-success"}>
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
      id: "account",
      header: "Account",
      cell: ({row}) => getTransactionAccount(row.original)?.id ? (
        <Button variant="link" size="sm" className="h-auto px-0" asChild>
          <Link
            to="/admin/finance/accounts/$accountId/dashboard"
            params={{accountId: getTransactionAccount(row.original)!.id}}
          >
            {getAccountDisplayName(getTransactionAccount(row.original) ?? undefined)}
          </Link>
        </Button>
      ) : (
        "Not set"
      ),
    })
  }

  baseColumns.push({
    id: "actions",
    header: "Actions",
    cell: ({row}) =>
      getTransactionAccount(row.original)?.id ? (
        <ButtonGroup>
          <Button variant="outline" size="sm" asChild>
            <Link
              to="/admin/finance/accounts/$accountId/dashboard"
              params={{accountId: getTransactionAccount(row.original)!.id}}
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
      initialRequest={TRANSACTIONS_INITIAL_REQUEST}
      filterFields={filterFields}
      searchPlaceholder={searchPlaceholder}
      emptyMessage="No transactions found."
    />
  )
}
