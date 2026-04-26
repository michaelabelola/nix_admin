import {SectionCard} from "#/modules/finance/FinancePrimitives.tsx"
import type {AccountModel} from "#/modules/finance/account/model.ts"
import {TransactionsTable} from "#/modules/finance/TransactionsTable.tsx"

export function AccountDetailsTransactionsTab({
  accountId,
}: {
  accountId: AccountModel.AccountID
}) {
  return (
    <SectionCard
      title="Transactions"
      description="Ledger activity filtered to this account."
    >
      <TransactionsTable
        from="/admin/finance/accounts/$accountId/transactions"
        fixedAccountId={accountId}
        searchPlaceholder="Search this account's transactions..."
      />
    </SectionCard>
  )
}
