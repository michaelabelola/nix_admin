import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/')({
    component: AdminRoute,
})

function AdminRoute() {
    return <div>base admin page</div>
}
