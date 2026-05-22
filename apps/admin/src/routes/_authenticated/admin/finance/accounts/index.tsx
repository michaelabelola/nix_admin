import {createFileRoute} from "@tanstack/react-router"

import {AccountsPage} from "#/modules/finance/AccountsPage.tsx"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/")({
  component: AccountsPage,
})
