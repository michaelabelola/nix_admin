import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreateAddressesStep} from "#/modules/customer/create/steps/CustomerCreateAddressesStep.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/addresses")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreateAddressesStep/>
}
