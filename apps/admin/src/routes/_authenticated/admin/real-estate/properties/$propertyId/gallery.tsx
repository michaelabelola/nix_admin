import {createFileRoute, useLocation, useNavigate} from "@tanstack/react-router";

import {PropertyApiHook} from "@suiteonix/server";
import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsGalleryTab} from "#/modules/real-estate/property/details/tabs/gallery/PropertyDetailsGalleryTab.tsx";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/gallery",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const navigate = useNavigate()
    const pathname = useLocation({
        select: (location) => location.pathname,
    })
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)
    const createOpen = pathname.endsWith("/gallery/create")

    return (
        <PropertyPage activeTab="gallery">
            <PropertyDetailsGalleryTab
                property={data}
                createOpen={createOpen}
                onCreateOpenChange={(open) => {
                    if (open) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/gallery/create",
                            params: {propertyId},
                        })
                        return
                    }

                    if (createOpen) {
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
