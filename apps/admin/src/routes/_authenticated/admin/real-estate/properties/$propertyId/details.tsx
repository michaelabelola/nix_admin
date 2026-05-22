import {createFileRoute} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsRecordTab} from "#/modules/real-estate/property/details/tabs/details/PropertyDetailsRecordTab.tsx";
import {PropertyApiHook} from "@suiteonix/server";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/details",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="details">
            <PropertyDetailsRecordTab property={data}/>
        </PropertyPage>
    )
}
