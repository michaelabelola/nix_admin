import {createFileRoute, Outlet} from '@tanstack/react-router'
import {Page404} from "@suiteonix/components";

export const Route = createFileRoute('/_authenticated/self/organizations')({
    component: RouteComponent,
    notFoundComponent: (props) => <Page404
        message="The route you requested does not exist or is no longer available." {...props}/>
})

function RouteComponent() {
    return <Outlet/>
}
