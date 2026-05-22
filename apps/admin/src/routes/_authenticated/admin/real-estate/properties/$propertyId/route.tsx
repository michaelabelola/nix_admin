import {Outlet, createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet/>
}
