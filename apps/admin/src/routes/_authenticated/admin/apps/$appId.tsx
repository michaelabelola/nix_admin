import {createFileRoute} from "@tanstack/react-router";

import {AppDetailsPage} from "#/modules/app/AppDetailsPage.tsx";

export const Route = createFileRoute("/_authenticated/admin/apps/$appId")({
    component: RouteComponent,
})

function RouteComponent() {
    const {appId} = Route.useParams()
    return <AppDetailsPage appId={appId}/>
}
