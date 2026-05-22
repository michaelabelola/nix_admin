import {Navigate, createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()

    return (
        <Navigate
            to="/admin/real-estate/properties/$propertyId/summary"
            params={{propertyId}}
        />
    )
}
