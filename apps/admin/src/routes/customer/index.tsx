import {createFileRoute} from "@tanstack/react-router"

import {CustomerLandingPage} from "#/modules/customer/public/LandingPage.tsx"

export const Route = createFileRoute("/customer/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <CustomerLandingPage/>
}
