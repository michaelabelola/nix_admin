import {createFileRoute} from "@tanstack/react-router";

import {AppsPage} from "#/modules/app/AppsPage.tsx";

export const Route = createFileRoute("/_authenticated/admin/apps/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <AppsPage/>
}
