import {createFileRoute} from "@tanstack/react-router"

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx"
import {PropertyListingProfileCreatePage} from "#/modules/real-estate/property/details/tabs/listing-profiles/create/PropertyListingProfileCreatePage.tsx"
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts"

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/listing-profiles/create",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="listing-profiles">
            <PropertyListingProfileCreatePage property={data} propertyId={propertyId}/>
        </PropertyPage>
    )
}
