import type {NavSectionType} from "#/modules/admin/user-admin/components/app-sidebar.tsx";
import {HomeIcon} from "lucide-react";

export const businessNavItems: NavSectionType = {
    title: 'Business',
    navs: [
        {
            name: "Home",
            icon: <HomeIcon/>,
            to: "/",
        }
    ]
} as NavSectionType
