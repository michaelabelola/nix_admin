"use client"

import {
    IconDots,
    IconFolder,
    IconShare3,
    IconTrash,
} from "@tabler/icons-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "#/components/ui/sidebar.tsx"
import type {NavSectionType} from "#/modules/self/components/app-sidebar.tsx";
import {Link} from "@tanstack/react-router";

export function NavSection({section}: {
    section: NavSectionType
}) {
    const {isMobile} = useSidebar()
    if (section?.hidden) return null
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu>
                {section?.navs?.map((item) => (
                    <SidebarMenuItem key={item.name} className={""}>
                        <SidebarMenuButton
                            asChild

                            // isActive={currentPath === item.to || (currentPath.startsWith(item.to as any))}
                        >
                            <Link to={item.to as any}
                                  activeOptions={{exact: true}}
                                  activeProps={{className: "bg-primary text-primary-foreground"}} className="flex-1">
                                {item.name}
                            </Link>
                            {/*<a href={item.to}>*/}
                            {/*    <item.icon/>*/}
                            {/*    <span>{item.name}</span>*/}
                            {/*</a>*/}
                        </SidebarMenuButton>
                        {item.overflowMenu &&
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className={"mt-1"}>
                                    <SidebarMenuAction
                                        showOnHover
                                        className="rounded-sm data-[state=open]:bg-accent"
                                    >
                                        <IconDots/>
                                        <span className="sr-only">More</span>
                                    </SidebarMenuAction>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-24 rounded-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align={isMobile ? "end" : "start"}
                                >
                                    <DropdownMenuItem>
                                        <IconFolder/>
                                        <span>Open</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <IconShare3/>
                                        <span>Share</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem variant="destructive">
                                        <IconTrash/>
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        }
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground/70">
                        <IconDots className="text-sidebar-foreground/70"/>
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
