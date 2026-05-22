import {createFileRoute} from "@tanstack/react-router";

import {AppDashboardPage} from "#/modules/app/AppDashboardPage.tsx";

export const Route = createFileRoute("/_authenticated/admin/apps/dashboard/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <AppDashboardPage/>
}
