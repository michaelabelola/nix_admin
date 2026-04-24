import {createFileRoute} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsGalleryTab} from "#/modules/real-estate/property/details/tabs/gallery/PropertyDetailsGalleryTab.tsx";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/gallery",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PropertyPage activeTab="gallery">
            <PropertyDetailsGalleryTab/>
        </PropertyPage>
    )
}
