import {createFileRoute} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsAboutTab} from "#/modules/real-estate/property/details/tabs/about/PropertyDetailsAboutTab.tsx";
import {PropertyApiHook} from "@suiteonix/server";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/about",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="about">
            <PropertyDetailsAboutTab property={data}/>
        </PropertyPage>
    )
}
