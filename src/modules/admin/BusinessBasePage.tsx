import {SidebarProvider} from "#/components/ui/sidebar.tsx";
import {Outlet} from "@tanstack/react-router";
import {AdminSidebar} from "#/modules/admin/components/side-nav/admin-sidebar.tsx";

const BusinessBasePage = () => {
    return (
        <SidebarProvider>
            <AdminSidebar/>
                {/*<SiteHeader/>*/}
            <main className={"w-full"}>
                <Outlet/>
            </main>
        </SidebarProvider>
    )
};

export default BusinessBasePage;