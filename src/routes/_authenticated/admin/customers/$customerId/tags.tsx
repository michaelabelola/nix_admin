import {createFileRoute} from "@tanstack/react-router"

import CustomerPage from "#/modules/customer/details/CustomerPage.tsx"
import {CustomerDetailsTagsTab} from "#/modules/customer/details/tabs/tags/CustomerDetailsTagsTab.tsx"
import {CustomerRequest} from "#/modules/customer/request.hook.ts"

export const Route = createFileRoute("/_authenticated/admin/customers/$customerId/tags")({
    component: RouteComponent,
})

function RouteComponent() {
    const {customerId} = Route.useParams()
    const {data} = CustomerRequest.useGetCustomerDetailed(customerId)

    return (
        <CustomerPage activeTab="tags">
            <CustomerDetailsTagsTab customer={data}/>
        </CustomerPage>
    )
}
