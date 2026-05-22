import {createFileRoute} from "@tanstack/react-router"

import {CustomerRegisterPage} from "#/modules/auth/register/CustomerRegisterPage.tsx"

export const Route = createFileRoute("/_auth/register")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerRegisterPage/>
}
