import {createFileRoute} from "@tanstack/react-router"

import {ListingsPage} from "#/modules/listing/ListingsPage.tsx"

export const Route = createFileRoute(
    "/_authenticated/admin/listings/",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <ListingsPage/>
}
