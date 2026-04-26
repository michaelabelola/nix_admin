import {createFileRoute} from "@tanstack/react-router"

import {TransactionsPage} from "#/modules/finance/TransactionsPage.tsx"

export const Route = createFileRoute("/_authenticated/admin/finance/transactions/")({
  component: TransactionsPage,
})
