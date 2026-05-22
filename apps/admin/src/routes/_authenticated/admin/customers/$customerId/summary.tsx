import {createFileRoute} from "@tanstack/react-router"

import CustomerPage from "#/modules/customer/details/CustomerPage.tsx"
import {CustomerDetailsSummaryTab} from "#/modules/customer/details/tabs/summary/CustomerDetailsSummaryTab.tsx"
import {CustomerRequest} from "#/modules/customer/request.hook.ts"

export const Route = createFileRoute("/_authenticated/admin/customers/$customerId/summary")({
    component: RouteComponent,
})

function RouteComponent() {
    const {customerId} = Route.useParams()
    const {data} = CustomerRequest.useGetCustomerDetailed(customerId)

    return (
        <CustomerPage activeTab="summary">
            <CustomerDetailsSummaryTab customer={data}/>
        </CustomerPage>
    )
}
