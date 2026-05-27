import {Navigate, createFileRoute} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/departments/$departmentId/")({
    component: RouteComponent,
})

function RouteComponent() {
    const {departmentId} = Route.useParams()

    return (
        <Navigate
            to="/admin/departments/$departmentId/details"
            params={{departmentId}}
        />
    )
}
