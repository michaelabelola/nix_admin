import {createFileRoute} from "@tanstack/react-router";

import {TagsDashboardPage} from "#/modules/tags/TagsDashboardPage.tsx";

export const Route = createFileRoute("/_authenticated/admin/tags/dashboard/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <TagsDashboardPage/>
}
