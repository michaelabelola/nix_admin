import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreatePage} from "#/modules/customer/create/CustomerCreatePage.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreatePage/>
}
