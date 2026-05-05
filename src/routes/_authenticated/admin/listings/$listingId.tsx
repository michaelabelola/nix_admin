import {createFileRoute} from "@tanstack/react-router"

import {ListingDetailsPage} from "#/modules/listing/ListingDetailsPage.tsx"

export const Route = createFileRoute(
    "/_authenticated/admin/listings/$listingId",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {listingId} = Route.useParams()

    return <ListingDetailsPage listingId={listingId}/>
}
