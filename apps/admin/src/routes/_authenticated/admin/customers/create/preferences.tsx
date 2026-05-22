import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreatePreferencesStep} from "#/modules/customer/create/steps/CustomerCreatePreferencesStep.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/preferences")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreatePreferencesStep/>
}
