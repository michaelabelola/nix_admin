import {createFileRoute} from "@tanstack/react-router";

import {CreateAppIntroPage} from "#/modules/app/create/CreateAppPage.tsx";

export const Route = createFileRoute("/_authenticated/admin/apps/create/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CreateAppIntroPage/>
}
