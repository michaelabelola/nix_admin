import {createFileRoute, Outlet} from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/organizations')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet/>
}
