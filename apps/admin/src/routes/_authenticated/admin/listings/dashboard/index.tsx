import {createFileRoute} from '@tanstack/react-router'
import ListingDashboard from "#/modules/listing/ListingDashboard.tsx";

export const Route = createFileRoute(
    '/_authenticated/admin/listings/dashboard/',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <ListingDashboard/>
}
