import {createFileRoute} from "@tanstack/react-router"

import AccountPage from "#/modules/finance/account/details/AccountPage.tsx"
import {AccountDetailsDashboardTab} from "#/modules/finance/account/details/tabs/dashboard/AccountDetailsDashboardTab.tsx"
import {AccountRequest} from "@suiteonix/server"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/$accountId/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  const {accountId} = Route.useParams()
  const {data} = AccountRequest.useGetAccountDetailed(accountId)

  return (
    <AccountPage activeTab="dashboard">
      <AccountDetailsDashboardTab account={data}/>
    </AccountPage>
  )
}
