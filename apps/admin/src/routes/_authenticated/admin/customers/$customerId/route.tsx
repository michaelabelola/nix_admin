import {Outlet, createFileRoute} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/customers/$customerId")({
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet/>
}
