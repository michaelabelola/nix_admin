import {createFileRoute} from "@tanstack/react-router"

import AccountPage from "#/modules/finance/account/details/AccountPage.tsx"
import {AccountDetailsTransactionsTab} from "#/modules/finance/account/details/tabs/transactions/AccountDetailsTransactionsTab.tsx"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/$accountId/transactions")({
  component: RouteComponent,
})

function RouteComponent() {
  const {accountId} = Route.useParams()

  return (
    <AccountPage activeTab="transactions">
      <AccountDetailsTransactionsTab accountId={accountId}/>
    </AccountPage>
  )
}
