import Page from "#/components/Page.tsx"
import {TransactionsTable} from "#/modules/finance/TransactionsTable.tsx"

export function TransactionsPage() {
  return (
    <Page
      header={{
        title: "Transactions",
        description: "Review the finance transaction ledger across accounts.",
      }}
    >
      <TransactionsTable from="/admin/finance/transactions"/>
    </Page>
  )
}
