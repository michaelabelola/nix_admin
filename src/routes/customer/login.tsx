import {createFileRoute} from "@tanstack/react-router"

import {CustomerLoginPage} from "#/modules/customer/public/CustomerLoginPage.tsx"

export const Route = createFileRoute("/customer/login")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerLoginPage/>
}
