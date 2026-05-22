import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreateTagsStep} from "#/modules/customer/create/steps/CustomerCreateTagsStep.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/tags")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreateTagsStep/>
}
