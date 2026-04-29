import {createFileRoute} from "@tanstack/react-router"

import {AccountCreatePage} from "#/modules/finance/account/create/AccountCreatePage.tsx"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/create")({
  component: AccountCreatePage,
})
