import {createFileRoute, useNavigate} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsFeaturesTab} from "#/modules/real-estate/property/details/tabs/features/PropertyDetailsFeaturesTab.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/features/create",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const navigate = useNavigate()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="features">
            <PropertyDetailsFeaturesTab
                property={data}
                createOpen
                onCreateOpenChange={(open) => {
                    if (!open) {
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
