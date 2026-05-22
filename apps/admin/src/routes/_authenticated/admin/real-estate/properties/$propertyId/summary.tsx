import {createFileRoute} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsSummaryTab} from "#/modules/real-estate/property/details/tabs/summary/PropertyDetailsSummaryTab.tsx";
import {PropertyApiHook} from "@suiteonix/server";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/summary",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="summary">
            <PropertyDetailsSummaryTab property={data}/>
        </PropertyPage>
    )
}
