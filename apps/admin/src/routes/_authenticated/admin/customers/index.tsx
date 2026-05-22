import {createFileRoute} from "@tanstack/react-router"

import {CustomersPage} from "#/modules/customer/CustomersPage.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomersPage/>
}
