import {createFileRoute} from "@tanstack/react-router"

import {ListingCreatePage} from "#/modules/listing/create/ListingCreatePage.tsx"

export const Route = createFileRoute(
    "/_authenticated/admin/listings/create",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <ListingCreatePage/>
}
