import {IconDashboard} from "@tabler/icons-react";
import {AppWindow} from "lucide-react";

import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx";

export const appNavItems: NavSectionType = {
    title: "Apps",
    navs: [
        {
            name: "Dashboard",
            icon: IconDashboard,
            to: "/admin/apps/dashboard",
        },
        {
            name: "Apps",
            icon: AppWindow,
            to: "/admin/apps",
        },
    ],
} as NavSectionType
