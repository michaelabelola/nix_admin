import {createFileRoute} from "@tanstack/react-router"
import {LandingPage} from "#/modules/LandingPage.tsx";


export const Route = createFileRoute("/_landing/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <LandingPage/>
}
