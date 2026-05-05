import {createFileRoute, Navigate} from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/')({
    component: AdminRoute,
})

function AdminRoute() {
    return <Navigate to={'/admin/real-estate/dashboard'}/>
    // return <div>base admin page</div>
}
