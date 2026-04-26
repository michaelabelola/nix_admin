import {createFileRoute} from "@tanstack/react-router"

import FinanceDashboard from "#/modules/finance/dashboard/FinanceDashboard.tsx"

export const Route = createFileRoute("/_authenticated/admin/finance/dashboard/")({
  component: FinanceDashboard,
})
