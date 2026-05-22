import {SidebarProvider} from "@suiteonix/ui";
import {Outlet} from "@tanstack/react-router";
import {AdminSidebar} from "#/modules/admin/components/side-nav/admin-sidebar.tsx";
import {OrganizationRequest} from "@suiteonix/server";
import DefaultBG from "/logo192.png";
import {useAuthenticatedUser} from "@suiteonix/server";
import {useThemeMode} from "#/components/ThemeToggle.tsx";

const BusinessBasePage = () => {
    const {mode} = useThemeMode()
    const {user} = useAuthenticatedUser()
    // var(--backgroundImageUrl)
    const {data: org} = OrganizationRequest.useGetOrganizationByID(user?.orgID || "")
    if (org?.logo && (mode === "light" || (mode === "auto" && !window.matchMedia("(prefers-color-scheme: dark)").matches))) {
        document.body.style.backgroundImage = `url("${org.logo}")`;
    } else if (org?.logoDark && (mode === "dark" || mode === "auto" && (window.matchMedia("(prefers-color-scheme: dark)").matches))) {
        document.body.style.backgroundImage = `url("${org.logoDark}")`;
    } else
        document.body.style.backgroundImage = DefaultBG;
    // org?.logo ? `url(${org.avatar})` : 'url("/logo192.png")'
    // if (org?.logo) {
    //     setBgImageUrl(`url("${org.logo}")`)
    // } else if (org?.logoDark) {
    //     setBgImageUrl(`url("${org.logoDark}")`)
    // }

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