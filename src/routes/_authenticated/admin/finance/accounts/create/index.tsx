import {createFileRoute} from "@tanstack/react-router"

import {AccountCreateStartPage} from "#/modules/finance/account/create/AccountCreatePage.tsx"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/create/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountCreateStartPage/>
}
