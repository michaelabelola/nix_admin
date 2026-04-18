import type {NavSectionType} from "#/modules/admin/user-admin/components/app-sidebar.tsx";
import {IconBrandOffice} from "@tabler/icons-react";

export const businessNavItems: NavSectionType = {
    title: 'Business',
    navs: [
        {
            name: "Home",
            icon: IconBrandOffice,
            to: "/",
        },
        {
            name: "My Businesses",
            icon: IconBrandOffice,
            to: "/admin/businesses",
        }
    ]
} as NavSectionType
