import {SidebarProvider} from "@suiteonix/ui";
import {Outlet} from "@tanstack/react-router";
import {AdminSidebar} from "#/modules/admin/components/side-nav/admin-sidebar.tsx";
import {OrganizationRequest} from "@suiteonix/server";
import DefaultBG from "#/assets/logo.png";
import {useAuthenticatedUser} from "@suiteonix/server";
import {useThemeMode} from "@suiteonix/components";

const BusinessBasePage = () => {
    const {mode} = useThemeMode()
    const {user} = useAuthenticatedUser()
    const {data: org} = OrganizationRequest.useGetOrganizationByID(user?.orgID || "")
    if (org?.logo && (mode === "light" || (mode === "auto" && !window.matchMedia("(prefers-color-scheme: dark)").matches))) {
        document.body.style.backgroundImage = `url("${org.logo}")`;
    } else if (org?.logoDark && (mode === "dark" || mode === "auto" && (window.matchMedia("(prefers-color-scheme: dark)").matches))) {
        document.body.style.backgroundImage = `url("${org.logoDark}")`;
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