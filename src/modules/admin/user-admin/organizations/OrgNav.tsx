import type {NavSectionType} from "#/modules/admin/user-admin/components/app-sidebar.tsx";
import {IconBrandOffice} from "@tabler/icons-react";

export const businessNavItems: NavSectionType = {
    title: 'Business',
    navs: [
        {
            name: "Home",
            icon: IconBrandOffice,
            to: "/admin/organizations/dashboard",
        },
        {
            name: "My Organizations",
            icon: IconBrandOffice,
            to: "/admin/organizations",
        }
    ]
} as NavSectionType
