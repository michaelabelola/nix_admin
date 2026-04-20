import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react"

import {NavSection} from "#/modules/admin/components/side-nav/nav-section.tsx"
import {NavMain} from "#/modules/admin/components/side-nav/nav-main.tsx"
import {NavSecondary} from "#/modules/admin/components/side-nav/nav-secondary.tsx"
import {NavUser} from "#/modules/admin/components/side-nav/nav-user.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "#/components/ui/sidebar.tsx"
import {useAuthenticatedUser} from "#/lib/authenticated-user.store.ts";
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar.tsx";
import OrganizationRequest from "#/modules/organization/organization.request.ts";
import {QuickToolTip} from "#/components/ui/tooltip.tsx";
import {useNavigate} from "@tanstack/react-router";
import {realEstateNavItems} from "#/modules/real-estate/OrgNav.tsx";
import {BriefcaseBusinessIcon, User2Icon} from "lucide-react";
import {Button} from "#/components/ui/button.tsx";
import type {ComponentProps} from "react";

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

export function AdminSidebar({...props}: ComponentProps<typeof Sidebar>) {
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
                                <Avatar className="grayscale cursor-pointer">
                                    <AvatarImage src={org?.logo}
                                                 alt={`${org?.shortName}`}
                                                 className={"object-cover"}/>
                                    <AvatarFallback className="rounded-lg bg-transparent">
                                        <BriefcaseBusinessIcon className="size-5! text-primary"/>
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-base font-semibold">{org?.shortName?.toUpperCase()}</span>
                            </a>
                        </SidebarMenuButton>
                        <QuickToolTip content={"User Page"}>
                            <Button asChild variant={"ghost"} onClick={() => navigate({
                                to: "/self"
                            })} className="ml-auto">
                                <User2Icon className="size-5!"/>
                            </Button>
                        </QuickToolTip>

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                {[realEstateNavItems].map((item, index) => (
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
