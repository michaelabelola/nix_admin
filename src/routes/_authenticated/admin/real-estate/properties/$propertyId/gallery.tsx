import {createFileRoute} from "@tanstack/react-router";

import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";
import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsGalleryTab} from "#/modules/real-estate/property/details/tabs/gallery/PropertyDetailsGalleryTab.tsx";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/gallery",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="gallery">
            <PropertyDetailsGalleryTab property={data}/>
        </PropertyPage>
    )
}
