import {createFileRoute} from "@tanstack/react-router"

import {CustomerCreateReviewStep} from "#/modules/customer/create/steps/CustomerCreateReviewStep.tsx"

export const Route = createFileRoute("/_authenticated/admin/customers/create/review")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerCreateReviewStep/>
}
