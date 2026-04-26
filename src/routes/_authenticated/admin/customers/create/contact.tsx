import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreateContactStep} from "#/modules/customer/create/steps/CustomerCreateContactStep.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/contact")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreateContactStep/>
}
