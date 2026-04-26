import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreatePersonalStep} from "#/modules/customer/create/steps/CustomerCreatePersonalStep.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/personal")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreatePersonalStep/>
}
