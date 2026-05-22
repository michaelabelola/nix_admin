import {createFileRoute} from "@tanstack/react-router"

import {CustomerRegisterPage} from "#/modules/customer/register/CustomerRegisterPage.tsx"

export const Route = createFileRoute("/customer/register")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerRegisterPage/>
}
