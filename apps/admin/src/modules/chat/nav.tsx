import {MessagesSquare} from "lucide-react"

import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx"

export const chatNavItems: NavSectionType = {
    title: "Chat",
    navs: [
        {
            name: "Chats",
            icon: MessagesSquare,
            to: "/admin/chats",
        },
    ],
} as NavSectionType
