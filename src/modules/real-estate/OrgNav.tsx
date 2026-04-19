import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx";
import {IconDashboard} from "@tabler/icons-react";
import {MapPin, BedDouble, Home, Scale} from "lucide-react"

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
            name: "Property Locations",
            icon: MapPin,
            to: "/admin/real-estate/properties/locations",
        },
        {
            name: "Spaces",
            icon: Home,
            to: "/admin/real-estate/spaces",
        },
        {
            name: "Space Types",
            icon: Scale,
            to: "/admin/real-estate/space-types",
        },
        {
            name: "Feature Rules",
            icon: Scale,
            to: "/admin/real-estate/feature-rules",
        }
    ]

} as NavSectionType