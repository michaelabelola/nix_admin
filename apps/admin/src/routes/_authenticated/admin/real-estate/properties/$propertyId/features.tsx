import {createFileRoute, useLocation, useNavigate} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsFeaturesTab} from "#/modules/real-estate/property/details/tabs/features/PropertyDetailsFeaturesTab.tsx";
import {PropertyApiHook} from "@suiteonix/server";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/features",
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
    const createOpen = pathname.endsWith("/features/create")

    return (
        <PropertyPage activeTab="features">
            <PropertyDetailsFeaturesTab
                property={data}
                createOpen={createOpen}
                onCreateOpenChange={(open) => {
                    if (open) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/features/create",
                            params: {propertyId},
                        })
                        return
                    }

                    if (createOpen) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/features",
                            params: {propertyId},
                            replace: true,
                        })
                    }
                }}
            />
        </PropertyPage>
    )
}
