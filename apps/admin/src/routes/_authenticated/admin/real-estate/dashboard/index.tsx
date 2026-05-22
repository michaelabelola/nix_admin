import {createFileRoute} from '@tanstack/react-router'
import RealEstateDashboard from "#/modules/real-estate/dashboard/RealEstateDashboard.tsx";

export const Route = createFileRoute(
    '/_authenticated/admin/real-estate/dashboard/',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <RealEstateDashboard/>
}
