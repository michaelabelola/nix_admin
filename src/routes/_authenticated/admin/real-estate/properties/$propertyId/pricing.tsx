import {createFileRoute} from "@tanstack/react-router";

import PropertyDetailsPage from "#/modules/real-estate/property/details/PropertyDetailsPage.tsx";
import {PropertyDetailsPricingTab} from "#/modules/real-estate/property/details/PropertyDetailsPricingTab.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/pricing",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyDetailsPage activeTab="pricing">
            <PropertyDetailsPricingTab property={data}/>
        </PropertyDetailsPage>
    )
}
