import {createFileRoute, useLocation} from "@tanstack/react-router"

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx"
import {PropertyListingProfileCreatePage} from "#/modules/real-estate/property/details/tabs/listing-profiles/create/PropertyListingProfileCreatePage.tsx"
import {PropertyDetailsListingProfilesTab} from "#/modules/real-estate/property/details/tabs/listing-profiles/PropertyDetailsListingProfilesTab.tsx"
import {PropertyApiHook} from "@suiteonix/server"

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/listing-profiles",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const pathname = useLocation({
        select: (location) => location.pathname,
    })
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)
    const createOpen = pathname.endsWith("/listing-profiles/create")

    return (
        <PropertyPage activeTab="listing-profiles">
            {createOpen ? (
                <PropertyListingProfileCreatePage property={data} propertyId={propertyId}/>
            ) : (
                <PropertyDetailsListingProfilesTab property={data}/>
            )}
        </PropertyPage>
    )
}
