import {createFileRoute, useNavigate} from "@tanstack/react-router";

import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";
import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsGalleryTab} from "#/modules/real-estate/property/details/tabs/gallery/PropertyDetailsGalleryTab.tsx";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/gallery/create",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const navigate = useNavigate()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="gallery">
            <PropertyDetailsGalleryTab
                property={data}
                createOpen
                onCreateOpenChange={(open) => {
                    if (!open) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/gallery",
                            params: {propertyId},
                            replace: true,
                        })
                    }
                }}
            />
        </PropertyPage>
    )
}
