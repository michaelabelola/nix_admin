import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx";
import {IconDashboard} from "@tabler/icons-react";
import {TagsIcon} from "lucide-react"

export const tagsNavItems: NavSectionType = {
    title: 'Tags',
    navs: [
        {
            name: "Dashboard",
            icon: IconDashboard,
            to: "/admin/tags/dashboard",
        },
        {
            name: "Tags",
            icon: TagsIcon,
            to: "/admin/tags",
        },

    ]

} as NavSectionType