import {createFileRoute} from "@tanstack/react-router";

import PropertyDetailsPage from "#/modules/real-estate/property/details/PropertyDetailsPage.tsx";
import {PropertyDetailsLeaseTab} from "#/modules/real-estate/property/details/PropertyDetailsLeaseTab.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/lease",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyDetailsPage activeTab="lease">
            <PropertyDetailsLeaseTab property={data}/>
        </PropertyDetailsPage>
    )
}
