import {type Icon} from "@tabler/icons-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@suiteonix/ui"
import ThemeToggle from "#/components/ThemeToggle.tsx";
import {Button} from "@suiteonix/ui";
import {Grid3X3Icon, Navigation2} from "lucide-react";

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <div className="flex flex-row gap-2">
                            <Button variant={"outline"}>
                                <Grid3X3Icon/>
                            </Button>
                            <Button variant={"outline"}>
                                <Navigation2/>
                            </Button>
                        <ThemeToggle type={1}/>
                    </div>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title}>
                                {item.icon && <item.icon/>}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
