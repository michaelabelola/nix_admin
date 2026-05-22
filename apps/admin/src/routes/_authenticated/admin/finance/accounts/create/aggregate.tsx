import {createFileRoute} from "@tanstack/react-router"

import {AggregateAccountCreatePage} from "#/modules/finance/account/create/AccountCreatePage.tsx"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/create/aggregate")({
  component: RouteComponent,
})

function RouteComponent() {
  return <AggregateAccountCreatePage/>
}
