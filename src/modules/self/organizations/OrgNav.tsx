import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx";
import {IconBrandOffice} from "@tabler/icons-react";

export const selfBusinessNavItems: NavSectionType = {
    title: 'Business',
    navs: [
        {
            name: "Home",
            icon: IconBrandOffice,
            to: "/self/organizations/dashboard",
        },
        {
            name: "My Organizations",
            icon: IconBrandOffice,
            to: "/self/organizations",
        }
    ]
} as NavSectionType
