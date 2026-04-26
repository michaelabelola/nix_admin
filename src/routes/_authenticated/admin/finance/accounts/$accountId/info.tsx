import {createFileRoute} from "@tanstack/react-router"

import AccountPage from "#/modules/finance/account/details/AccountPage.tsx"
import {AccountDetailsInfoTab} from "#/modules/finance/account/details/tabs/info/AccountDetailsInfoTab.tsx"
import {AccountRequest} from "#/modules/finance/account/request.hook.ts"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/$accountId/info")({
  component: RouteComponent,
})

function RouteComponent() {
  const {accountId} = Route.useParams()
  const {data} = AccountRequest.useGetAccountDetailed(accountId)

  return (
    <AccountPage activeTab="info">
      <AccountDetailsInfoTab account={data}/>
    </AccountPage>
  )
}
