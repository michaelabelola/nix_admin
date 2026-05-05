import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx";
import {IconDashboard} from "@tabler/icons-react";
import {Newspaper} from "lucide-react"

export const listingNavItems: NavSectionType = {
    title: 'Listings',
    navs: [
        {
            name: "Dashboard",
            icon: IconDashboard,
            to: "/admin/listings/dashboard",
        },
        {
            name: "Listings",
            icon: Newspaper,
            to: "/admin/listings",
        }
    ]

} as NavSectionType
