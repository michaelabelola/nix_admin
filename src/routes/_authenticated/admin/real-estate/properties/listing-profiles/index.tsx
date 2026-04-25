import {createFileRoute} from "@tanstack/react-router"

import {ListingProfilesPage} from "#/modules/real-estate/property-listing-profile/ListingProfilesPage.tsx"

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/listing-profiles/",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <ListingProfilesPage/>
}
