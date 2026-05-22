import {createFileRoute, useLocation, useNavigate} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsPricingTab} from "#/modules/real-estate/property/details/tabs/pricing/PropertyDetailsPricingTab.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/pricing",
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
    const createOpen = pathname.endsWith("/pricing/create")

    return (
        <PropertyPage activeTab="pricing">
            <PropertyDetailsPricingTab
                property={data}
                createOpen={createOpen}
                onCreateOpenChange={(open) => {
                    if (open) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/pricing/create",
                            params: {propertyId},
                        })
                        return
                    }

                    if (createOpen) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/pricing",
                            params: {propertyId},
                            replace: true,
                        })
                    }
                }}
            />
        </PropertyPage>
    )
}
