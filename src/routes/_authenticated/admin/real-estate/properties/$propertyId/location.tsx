import {createFileRoute} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsLocationTab} from "#/modules/real-estate/property/details/tabs/location/PropertyDetailsLocationTab.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/location",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="location">
            <PropertyDetailsLocationTab property={data}/>
        </PropertyPage>
    )
}
