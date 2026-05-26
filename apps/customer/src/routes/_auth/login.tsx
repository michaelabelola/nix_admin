import {createFileRoute} from "@tanstack/react-router"
import {CustomerLoginPage} from "#/modules/auth/login/CustomerLoginPage.tsx";


export const Route = createFileRoute("/_auth/login")({
    validateSearch: (search: { email?: string }) => {
        const email = typeof search.email === "string" ? search.email : ""

        return {
            ...(email ? {email} : {}),
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const search = Route.useSearch()

    return <CustomerLoginPage initialEmail={search.email ?? ""}/>
}
