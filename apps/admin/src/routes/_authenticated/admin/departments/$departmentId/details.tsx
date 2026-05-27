import {createFileRoute} from "@tanstack/react-router"

import {DepartmentDetailsTab} from "#/modules/department/DepartmentDetailsTab.tsx"
import {DepartmentPage} from "#/modules/department/DepartmentPage.tsx"
import {DepartmentRequest} from "@suiteonix/server"

export const Route = createFileRoute("/_authenticated/admin/departments/$departmentId/details")({
    component: RouteComponent,
})

function RouteComponent() {
    const {departmentId} = Route.useParams()
    const {data} = DepartmentRequest.useGetDepartment(departmentId)

    return (
        <DepartmentPage activeTab="details">
            <DepartmentDetailsTab department={data}/>
        </DepartmentPage>
    )
}
