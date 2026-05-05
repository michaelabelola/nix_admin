import {createFileRoute, useLocation} from "@tanstack/react-router"

import {PropertyListingProfileDetailsPage} from "#/modules/real-estate/property-listing-profile/PropertyListingProfileDetailsPage.tsx"

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/listing-profiles/$listingProfileId",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {listingProfileId} = Route.useParams()
    const {pathname} = useLocation()
    const activeTab = pathname.endsWith("/gallery") ? "gallery" : "details"

    return <PropertyListingProfileDetailsPage activeTab={activeTab} listingProfileId={listingProfileId}/>
}
