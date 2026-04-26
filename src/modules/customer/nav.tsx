import {Users} from "lucide-react"

import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx"

export const customerNavItems: NavSectionType = {
    title: "Customers",
    navs: [
        {
            name: "Customers",
            icon: Users,
            to: "/admin/customers",
        },
    ],
} as NavSectionType
