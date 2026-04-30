import {createFileRoute} from "@tanstack/react-router"

import {NixAccountCreatePage} from "#/modules/finance/account/create/AccountCreatePage.tsx"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/create/nix")({
  component: RouteComponent,
})

function RouteComponent() {
  return <NixAccountCreatePage/>
}
