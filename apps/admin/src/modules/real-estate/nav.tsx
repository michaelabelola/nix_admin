import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx";
import {IconDashboard} from "@tabler/icons-react";
import {BedDouble, ListIcon, Scale} from "lucide-react"

export const realEstateNavItems: NavSectionType = {
    title: 'Real Estate',
    navs: [
        {
            name: "Dashboard",
            icon: IconDashboard,
            to: "/admin/real-estate/dashboard",
        },
        {
            name: "Properties",
            icon: BedDouble,
            to: "/admin/real-estate/properties",
        },
        {
            name: "Listing Profiles",
            icon: ListIcon,
            to: "/admin/real-estate/properties/listing-profiles",
        },
        {
            name: "Feature Rules",
            icon: Scale,
            to: "/admin/real-estate/feature-rules",
        }
    ]

} as NavSectionType
