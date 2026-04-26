import {IconDashboard} from "@tabler/icons-react"
import {ArrowRightLeft, Landmark} from "lucide-react"

import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx"

export const financeNavItems: NavSectionType = {
  title: "Finance",
  navs: [
    {
      name: "Dashboard",
      icon: IconDashboard,
      to: "/admin/finance/dashboard",
    },
    {
      name: "Accounts",
      icon: Landmark,
      to: "/admin/finance/accounts",
    },
    {
      name: "Transactions",
      icon: ArrowRightLeft,
      to: "/admin/finance/transactions",
    },
  ],
} as NavSectionType
