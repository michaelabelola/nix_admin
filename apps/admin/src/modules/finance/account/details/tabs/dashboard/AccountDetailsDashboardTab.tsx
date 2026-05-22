import {Link} from "@tanstack/react-router"

import {Button} from "#/components/ui/button.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Separator} from "#/components/ui/separator.tsx"
import {AccountModel} from "#/modules/finance/account/model.ts"
import {SummaryMetric} from "#/modules/finance/FinancePrimitives.tsx"
import {TransactionRequest} from "#/modules/finance/transaction/request.hook.ts"
import {
  formatDateTime,
  formatMoney,
  getAccountCurrencies,
  getPrimaryBalance,
  transactionStatusBadgeVariant,
} from "#/modules/finance/finance.utils.tsx"

export function AccountDetailsDashboardTab({account}: { account?: AccountModel.Detailed }) {
  const recentTransactionsQuery = TransactionRequest.useQueryTransactions({
    entries: account?.id ? [{account: {id: account.id}}] : undefined,
    page: 0,
    size: 5,
    sort: [{field: "audit.createdDate", direction: "DESC"}],
  })
  const primaryBalance = getPrimaryBalance(account)
  const currencies = getAccountCurrencies(account)

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-lg border p-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Overview</h2>
            <p className="text-sm text-muted-foreground">High-level operating view for this account.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryMetric label="Type" value={account?.type || null}/>
            <SummaryMetric label="Status" value={account?.status || null}/>
            <SummaryMetric label="Balances" value={account?.balance ? "1" : "0"}/>
            <SummaryMetric label="Currencies" value={String(currencies.length)}/>
          </div>
          <Separator/>
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryMetric label="Current Balance" value={formatMoney(primaryBalance?.current)}/>
            <SummaryMetric label="Ledger Balance" value={formatMoney(primaryBalance?.ledger)}/>
            <SummaryMetric label="Primary Currency" value={primaryBalance?.currency || null}/>
            <SummaryMetric label="Account Number" value={account?.accountNumber || null}/>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">Latest ledger movements recorded on this account.</p>
          </div>
          <div className="space-y-3">
            {(recentTransactionsQuery.data?.content ?? []).map((transaction) => (
              <div key={transaction.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-medium">{transaction.reference || transaction.externalReference || transaction.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(transaction.occurredAt) || "No occurrence date"}
                    </div>
                  </div>
                  {transaction.status ? (
                    <Badge variant={transactionStatusBadgeVariant[transaction.status]}>
                      {transaction.status}
                    </Badge>
                  ) : null}
                </div>
                <div className="mt-3 text-sm font-medium">{formatMoney(transaction.amount) || "Not set"}</div>
              </div>
            ))}
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin/finance/accounts/$accountId/transactions" params={{accountId: account?.id || ""}}>
              View all transactions
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
