import {createFileRoute} from "@tanstack/react-router";

import {PropertiesPage} from "#/modules/real-estate/property/PropertiesPage.tsx";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <PropertiesPage/>
}
