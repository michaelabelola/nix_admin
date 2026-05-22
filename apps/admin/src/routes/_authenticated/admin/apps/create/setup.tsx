import {createFileRoute} from "@tanstack/react-router";

import {CreateAppPage} from "#/modules/app/create/CreateAppPage.tsx";

export const Route = createFileRoute("/_authenticated/admin/apps/create/setup")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CreateAppPage/>
}
