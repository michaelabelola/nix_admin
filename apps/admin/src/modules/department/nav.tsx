import {Building2} from "lucide-react"

import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx"

export const departmentsNavItems: NavSectionType = {
    title: "Departments",
    navs: [
        {
            name: "Departments",
            icon: Building2,
            to: "/admin/departments",
        },
    ],
} as NavSectionType
