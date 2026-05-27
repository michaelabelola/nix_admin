import {createFileRoute} from "@tanstack/react-router"

import {DepartmentsPage} from "#/modules/department/DepartmentsPage.tsx"

export const Route = createFileRoute("/_authenticated/admin/departments/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <DepartmentsPage/>
}
