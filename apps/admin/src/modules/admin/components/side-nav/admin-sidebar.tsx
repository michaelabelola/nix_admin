import {
    IconCamera,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconHelp,
    IconReport,
    IconSearch,
    IconSettings,
} from "@tabler/icons-react"

import {NavSection} from "#/modules/admin/components/side-nav/nav-section.tsx"
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
} from "@suiteonix/ui"
import {useAuthenticatedUser} from "@suiteonix/server";
import {Avatar, AvatarFallback, AvatarImage} from "@suiteonix/ui";
import {OrganizationRequest} from "@suiteonix/server";
import {useNavigate} from "@tanstack/react-router";
import {realEstateNavItems} from "#/modules/real-estate/nav.tsx";
import {BriefcaseBusinessIcon, User2Icon} from "lucide-react";
import {Button} from "@suiteonix/ui";
import {type ComponentProps} from "react";
import {tagsNavItems} from "#/modules/tags/nav.tsx";
import {customerNavItems} from "#/modules/customer/nav.tsx";
import {financeNavItems} from "#/modules/finance/nav.tsx";
import {appNavItems} from "#/modules/app/nav.tsx";
import {NavMain} from "#/modules/admin/components/side-nav/nav-main.tsx";
import {listingNavItems} from "#/modules/listing/nav.tsx";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        // {
        //     title: "Dashboard",
        //     url: "",
        //     icon: IconDashboard,
        // },
        // {
        //     title: "Lifecycle",
        //     url: "/",
        //     icon: IconListDetails,
        // },
        // {
        //     title: "Analytics",
        //     url: "#",
        //     icon: IconChartBar,
        // },
        // {
        //     title: "Projects",
        //     url: "#",
        //     icon: IconFolder,
        // },
        // {
        //     title: "Team",
        //     url: "#",
        //     icon: IconUsers,
        // },
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
    const selectedImage = org?.logo ?? undefined
    return (
        <Sidebar collapsible="offcanvas" {...props} className={"bg-background/80 backdrop-blur-sm border-r"}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className={"flex "}>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >

                            <a href="#">
                                <Avatar className="h-8 w-8 rounded-lg grayscale cursor-pointer">
                                    <AvatarImage src={selectedImage}
                                                 alt={`${org?.shortName}`}
                                                 className={"object-cover border-transparent"}/>
                                    <AvatarFallback className="rounded-lg bg-transparent">
                                        <BriefcaseBusinessIcon className="size-5! text-primary"/>
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-base font-semibold">{org?.shortName?.toUpperCase()}</span>
                            </a>
                        </SidebarMenuButton>
                        {/*<QuickToolTip content={"User Page"}>*/}
                        <Button variant={"ghost"} onClick={() => navigate({
                            to: "/admin/public-profile"
                        })} className="ml-auto">
                            <User2Icon className="size-7!"/>
                        </Button>
                        {/*</QuickToolTip>*/}

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                {[realEstateNavItems, customerNavItems, listingNavItems, financeNavItems, appNavItems, tagsNavItems].map((item, index) => (
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
