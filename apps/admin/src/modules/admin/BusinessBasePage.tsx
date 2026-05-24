import {SidebarProvider} from "@suiteonix/ui";
import {Outlet} from "@tanstack/react-router";
import {AdminSidebar} from "#/modules/admin/components/side-nav/admin-sidebar.tsx";
import {OrganizationRequest} from "@suiteonix/server";
import DefaultBG from "#/assets/logo.png";
import {useAuthenticatedUser} from "@suiteonix/server";

const BusinessBasePage = () => {
    const {user} = useAuthenticatedUser()
    const {data: org} = OrganizationRequest.useGetOrganizationByID(user?.orgID || "")
    if (org?.logo) {
        document.body.style.backgroundImage = `url("${org.logo}")`;
    } else
        document.body.style.backgroundImage = DefaultBG;
    return (
        <SidebarProvider>
            <AdminSidebar/>
            {/*<SiteHeader/>*/}
            <div className={"min-w-0 w-full"}>
                <Outlet/>
            </div>
        </SidebarProvider>
    )
};

export default BusinessBasePage;
