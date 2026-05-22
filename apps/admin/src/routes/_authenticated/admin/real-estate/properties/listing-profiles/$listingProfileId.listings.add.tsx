import {createFileRoute} from "@tanstack/react-router"

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/listing-profiles/$listingProfileId/listings/add",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return null
}
