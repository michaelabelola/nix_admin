import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreateBusinessStep} from "#/modules/customer/create/steps/CustomerCreateBusinessStep.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/business")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreateBusinessStep/>
}
