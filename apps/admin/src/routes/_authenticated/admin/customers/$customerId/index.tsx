import {Navigate, createFileRoute} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/customers/$customerId/")({
    component: RouteComponent,
})

function RouteComponent() {
    const {customerId} = Route.useParams()

    return (
        <Navigate
            to="/admin/customers/$customerId/summary"
            params={{customerId}}
        />
    )
}
