import {createFileRoute} from '@tanstack/react-router'
import {AdminPage} from "#/modules/admin/components/AdminPage.tsx";

export const Route = createFileRoute('/_authenticated/admin')({
    component: RouteComponent,
})

function RouteComponent() {
    return <AdminPage/>
}
