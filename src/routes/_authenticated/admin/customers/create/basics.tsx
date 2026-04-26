import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreateBasicsStep} from "#/modules/customer/create/steps/CustomerCreateBasicsStep.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/basics")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreateBasicsStep/>
}
