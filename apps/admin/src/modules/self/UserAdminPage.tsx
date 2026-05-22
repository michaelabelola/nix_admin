import {AppSidebar} from "#/modules/self/components/app-sidebar.tsx";
import {SidebarProvider} from "@suiteonix/ui";
import {Outlet} from "@tanstack/react-router";
import {Card, CardDescription, CardHeader, CardTitle} from "@suiteonix/ui";
import {Spinner} from "@suiteonix/ui";
import {useAuthenticatedUser} from "@suiteonix/server";

export function UserAdminPage() {
    const {isHydrated} = useAuthenticatedUser()

    if (!isHydrated) {
        return (
            <main className="px-4 py-10 h-screen flex w-full items-center bg-background/70">
                <Card className="mx-auto max-w-xl shadow-sm h-fit w-12/12 md:w-5/12">
                    <CardHeader>
                        <CardTitle
                            className={"flex flex-col-reverse items-center gap-4 md:gap-0 md:justify-between md:flex-row"}>
                            Loading admin workspace
                            <div className={"text-xl"}><Spinner className={"size-6 md:size-4"}/></div>
                        </CardTitle>
                        <CardDescription className={"text-center md:text-left"}>
                            Resolving your authenticated session.
                        </CardDescription>
                    </CardHeader>
                    {/*<CardContent/>*/}
                </Card>
            </main>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar/>
                {/*<SiteHeader/>*/}
                <Outlet/>
        </SidebarProvider>
    )
}
