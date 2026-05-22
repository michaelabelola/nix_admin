import {createFileRoute, Outlet, useLocation} from "@tanstack/react-router"

import {PropertyListingProfileDetailsPage} from "#/modules/real-estate/property-listing-profile/PropertyListingProfileDetailsPage.tsx"

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/listing-profiles/$listingProfileId/listings",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {listingProfileId} = Route.useParams()
    const {pathname} = useLocation()

    return (
        <>
            <PropertyListingProfileDetailsPage
                activeTab="listings"
                listingProfileId={listingProfileId}
                isAddListingOpen={pathname.endsWith("/add")}
            />
            <Outlet/>
        </>
    )
}
