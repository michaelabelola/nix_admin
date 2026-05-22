import {Link} from "@tanstack/react-router"
import {ArrowRightLeft, Banknote, CirclePlus, Landmark, WalletCards} from "lucide-react"

import Page from "#/components/Page.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {AccountRequest} from "@suiteonix/server"
import {FinanceCurrencyRequest} from "@suiteonix/server"
import {TransactionRequest} from "@suiteonix/server"
import {
  accountStatusBadgeVariant,
  formatDateTime,
  formatMoney,
  getAccountDisplayName,
  getTransactionAccount,
  transactionStatusBadgeVariant,
} from "#/modules/finance/finance.utils.tsx"

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: typeof Landmark
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl">{value}</CardTitle>
        </div>
        <div className="rounded-lg border p-2 text-muted-foreground">
          <Icon className="size-5"/>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

const FinanceDashboard = () => {
  const accountsQuery = AccountRequest.useQueryAccounts({
    page: 0,
    size: 5,
    sort: [{field: "audit.createdDate", direction: "DESC"}],
  })
  const primaryAccountsQuery = AccountRequest.useQueryAccounts({
    page: 0,
    size: 1,
    primaryAccount: true,
  })
  const supportedCurrenciesQuery = FinanceCurrencyRequest.useGetAllCurrencies()
  const transactionsQuery = TransactionRequest.useQueryTransactions({
    page: 0,
    size: 6,
    sort: [{field: "audit.createdDate", direction: "DESC"}],
  })

  return (
    <Page
      header={{
        title: "Finance",
        description: "Track account coverage, transaction flow, and recent ledger activity.",
        actionView: (
          <ButtonGroup>
            <Button variant="outline" asChild>
              <Link to="/admin/finance/accounts">Accounts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/finance/accounts/create">
                Create Account
                <CirclePlus className="size-4"/>
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/finance/transactions">Transactions</Link>
            </Button>
          </ButtonGroup>
        ),
      }}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Accounts"
            value={String(accountsQuery.data?.totalElements ?? 0)}
            description="Registered finance accounts available to the org."
            icon={Landmark}
          />
          <MetricCard
            title="Transactions"
            value={String(transactionsQuery.data?.totalElements ?? 0)}
            description="Ledger records currently available in finance."
            icon={ArrowRightLeft}
          />
          <MetricCard
            title="Primary Accounts"
            value={String(primaryAccountsQuery.data?.totalElements ?? 0)}
            description="Accounts flagged as primary settlement or operating accounts."
            icon={WalletCards}
          />
          <MetricCard
            title="Supported Currencies"
            value={String(supportedCurrenciesQuery.data?.length ?? 0)}
            description="Currencies available for account creation and balance tracking."
            icon={Banknote}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Recent Accounts</CardTitle>
              <CardDescription>The latest accounts created or refreshed in this workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(accountsQuery.data?.content ?? []).map((account) => (
                <div key={account.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{getAccountDisplayName(account)}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.accountNumber || account.providerAccountId || account.id}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {account.status ? (
                      <Badge variant={(accountStatusBadgeVariant as any)[account.status]}>
                        {account.status}
                      </Badge>
                    ) : null}
                    <Badge variant="outline">{account.type || "TYPE_UNSET"}</Badge>
                    {account.primaryAccount ? <Badge variant="success">Primary</Badge> : null}
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin/finance/accounts/$accountId/dashboard" params={{accountId: account.id}}>
                        Open
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest movements recorded across connected accounts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(transactionsQuery.data?.content ?? []).map((transaction) => (
                <div key={transaction.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{transaction.reference || transaction.externalReference || transaction.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {getAccountDisplayName(getTransactionAccount(transaction))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(transaction.occurredAt) || "No occurrence date"}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {transaction.status ? (
                        <Badge variant={transactionStatusBadgeVariant[transaction.status]}>
                          {transaction.status}
                        </Badge>
                      ) : null}
                      <Badge variant="outline">{transaction.type || "TYPE_UNSET"}</Badge>
                      <span className="text-sm font-medium">{formatMoney(transaction.amount) || "Not set"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}

export default FinanceDashboard
