import {createFileRoute, Outlet} from '@tanstack/react-router'
import {Page404} from "@suiteonix/components";

export const Route = createFileRoute(
    '/_authenticated/admin/real-estate',
)({
    component: RouteComponent,
    notFoundComponent: (props) => <Page404{...props}/>
})

function RouteComponent() {
    return <Outlet/>
}
