import * as React from "react"
import {
    type Icon,
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react"

import {NavSection} from "#/modules/self/components/nav-section.tsx"
import {NavMain} from "#/modules/self/components/nav-main.tsx"
import {NavSecondary} from "#/modules/self/components/nav-secondary.tsx"
import {NavUser} from "#/modules/self/components/nav-user.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "#/components/ui/sidebar.tsx"
import {selfBusinessNavItems} from "#/modules/self/organizations/OrgNav.tsx";
import type {FileRoutesByTo} from "#/routeTree.gen.ts";
import {useAuthenticatedUser} from "#/lib/authenticated-user.store.ts";
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar.tsx";
import OrganizationRequest from "#/modules/organization/organization.request.ts";
import {QuickToolTip} from "#/components/ui/tooltip.tsx";
import {useNavigate} from "@tanstack/react-router";

export type NavSectionType = {
    title?: string,
    hidden?: boolean
    navs?: {
        name?: string
        to?: keyof FileRoutesByTo
        icon?: Icon | any
    }[]
}

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "",
            icon: IconDashboard,
        },
        {
            title: "Lifecycle",
            url: "/",
            icon: IconListDetails,
        },
        {
            title: "Analytics",
            url: "#",
            icon: IconChartBar,
        },
        {
            title: "Projects",
            url: "#",
            icon: IconFolder,
        },
        {
            title: "Team",
            url: "#",
            icon: IconUsers,
        },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: IconDatabase,
        },
        {
            name: "Reports",
            url: "#",
            icon: IconReport,
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: IconFileWord,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {user} = useAuthenticatedUser()
    const {data: org} = OrganizationRequest.useGetOrganizationByID(user?.orgID || "")
    const navigate = useNavigate()
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className={"flex "}>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="size-5!"/>
                                <span className="text-base font-semibold">Suiteonix Inc.</span>
                            </a>
                        </SidebarMenuButton>
                        {user?.orgID && (
                            <QuickToolTip content={org?.name || "Organization Name"}>
                                <Avatar className="grayscale cursor-pointer" onClick={() => {
                                    navigate({
                                        to: "/admin"
                                    })
                                }}>
                                    <AvatarImage src={org?.logo} alt={`${org?.shortName}`}
                                                 className={"object-cover"}/>
                                    <AvatarFallback className="rounded-lg">{org?.shortName}</AvatarFallback>
                                </Avatar>
                            </QuickToolTip>)}

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                {[selfBusinessNavItems].map((item, index) => (
                    <NavSection key={`${item.title}_${index}`} section={item}/>

                ))}
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
        </Sidebar>
    )
}
