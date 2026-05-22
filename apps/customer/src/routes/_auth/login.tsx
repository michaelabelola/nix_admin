import {createFileRoute} from "@tanstack/react-router"
import {CustomerLoginPage} from "#/modules/auth/login/CustomerLoginPage.tsx";


export const Route = createFileRoute("/_auth/login")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerLoginPage/>
}
