import {createFileRoute} from "@tanstack/react-router"

import {DepartmentCreatePage} from "#/modules/department/DepartmentCreatePage.tsx"

export const Route = createFileRoute("/_authenticated/admin/departments/create")({
    component: RouteComponent,
})

function RouteComponent() {
    return <DepartmentCreatePage/>
}
