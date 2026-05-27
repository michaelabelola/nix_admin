import {createFileRoute, Outlet} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/departments/$departmentId")({
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet/>
}
