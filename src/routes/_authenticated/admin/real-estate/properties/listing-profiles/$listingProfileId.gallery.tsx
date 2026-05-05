import {createFileRoute} from "@tanstack/react-router"

import {PropertyListingProfileDetailsPage} from "#/modules/real-estate/property-listing-profile/PropertyListingProfileDetailsPage.tsx"

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/listing-profiles/$listingProfileId/gallery",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {listingProfileId} = Route.useParams()

    return <PropertyListingProfileDetailsPage activeTab="gallery" listingProfileId={listingProfileId}/>
}
