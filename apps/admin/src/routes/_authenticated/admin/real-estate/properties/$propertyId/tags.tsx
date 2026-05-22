import {createFileRoute} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsTagsTab} from "#/modules/real-estate/property/details/tabs/tags/PropertyDetailsTagsTab.tsx";
import {PropertyApiHook} from "@suiteonix/server";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/tags",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="tags">
            <PropertyDetailsTagsTab property={data}/>
        </PropertyPage>
    )
}
