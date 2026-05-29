import {createFileRoute} from "@tanstack/react-router"

import {DepartmentMembersPanel} from "#/modules/department/detail/DepartmentMembersSheet.tsx"
import {DepartmentPage} from "#/modules/department/detail/DepartmentPage.tsx"
import {DepartmentRequest} from "@suiteonix/server"

export const Route = createFileRoute("/_authenticated/admin/departments/$departmentId/members")({
    component: RouteComponent,
})

function RouteComponent() {
    const {departmentId} = Route.useParams()
    const {data} = DepartmentRequest.useGetDepartment(departmentId)

    return (
        <DepartmentPage activeTab="members">
            <DepartmentMembersPanel department={data}/>
        </DepartmentPage>
    )
}
