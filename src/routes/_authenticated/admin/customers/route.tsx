import {createFileRoute, Outlet} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/customers")({
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet/>
}
