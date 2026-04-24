import {createFileRoute, Outlet} from '@tanstack/react-router'
import Page404 from "#/components/pages/Page404.tsx";

export const Route = createFileRoute(
    '/_authenticated/admin/real-estate',
)({
    component: RouteComponent,
    notFoundComponent: (props) => <Page404{...props}/>
})

function RouteComponent() {
    return <Outlet/>
}
