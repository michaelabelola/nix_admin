import {createFileRoute} from "@tanstack/react-router"

import CustomerPage from "#/modules/customer/details/CustomerPage.tsx"
import {CustomerDetailsRecordTab} from "#/modules/customer/details/tabs/details/CustomerDetailsRecordTab.tsx"
import {CustomerRequest} from "#/modules/customer/request.hook.ts"

export const Route = createFileRoute("/_authenticated/admin/customers/$customerId/details")({
    component: RouteComponent,
})

function RouteComponent() {
    const {customerId} = Route.useParams()
    const {data} = CustomerRequest.useGetCustomerDetailed(customerId)

    return (
        <CustomerPage activeTab="details">
            <CustomerDetailsRecordTab customer={data}/>
        </CustomerPage>
    )
}
