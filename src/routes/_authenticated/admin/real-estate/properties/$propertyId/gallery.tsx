import {createFileRoute} from "@tanstack/react-router";

import PropertyDetailsPage from "#/modules/real-estate/property/details/PropertyDetailsPage.tsx";
import {PropertyDetailsGalleryTab} from "#/modules/real-estate/property/details/PropertyDetailsGalleryTab.tsx";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/gallery",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PropertyDetailsPage activeTab="gallery">
            <PropertyDetailsGalleryTab/>
        </PropertyDetailsPage>
    )
}
