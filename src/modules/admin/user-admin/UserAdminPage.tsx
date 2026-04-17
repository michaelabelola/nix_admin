import {AppSidebar} from "#/modules/admin/user-admin/components/app-sidebar.tsx";
import {SidebarProvider} from "#/components/ui/sidebar.tsx";
import {SiteHeader} from "#/modules/admin/user-admin/components/site-header.tsx";

export function UserAdminPage() {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <main className={"w-full"}>
                <SiteHeader/>
            </main>
        </SidebarProvider>
    )
}
