import {useState} from "react";
import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "#/components/ui/avatar.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog.tsx";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "#/components/ui/sidebar.tsx"
import {UserRequest} from "@suiteonix/server";
import {useLogout} from "@suiteonix/server";

export function NavUser() {
    const {isMobile} = useSidebar()
    const {data: user} = UserRequest.useGetAuthenticatedUser()
    const {logout} = useLogout()
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

    const logoutCheck = () => {
        setIsLogoutDialogOpen(true)
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg grayscale">
                                    <AvatarImage src={user?.avatar} alt={`${user?.firstname}'s avatar`}
                                                 className={"object-cover border"}/>
                                    <AvatarFallback className="rounded-lg">{user?.firstname}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                <span
                                    className="truncate font-medium">{user?.firstname} . {user?.lastname?.substring(0, 1)}</span>
                                    <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
                                </div>
                                <IconDotsVertical className="ml-auto size-4"/>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                                        <AvatarImage src={user?.avatar} alt={`${user?.firstname}'s avatar`}
                                                     className={"object-cover border"}/>
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user?.firstname}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <IconUserCircle/>
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <IconCreditCard/>
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <IconNotification/>
                                    Notifications
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem variant={"destructive"} onClick={logoutCheck}>
                                <IconLogout/>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be signed out of your current session and returned to the home page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            className={"cursor-pointer"}
                            onClick={() => {
                                setIsLogoutDialogOpen(false)
                                logout()
                            }}
                        >
                            Log out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
