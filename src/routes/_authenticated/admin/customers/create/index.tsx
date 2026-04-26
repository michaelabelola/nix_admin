import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreateStart} from "#/modules/customer/create/CustomerCreateStart.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreateStart/>
}
