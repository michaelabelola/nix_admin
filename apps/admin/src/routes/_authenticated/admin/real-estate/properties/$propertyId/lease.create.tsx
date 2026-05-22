import {createFileRoute, useNavigate} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsLeaseTab} from "#/modules/real-estate/property/details/tabs/lease/PropertyDetailsLeaseTab.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/lease/create",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const navigate = useNavigate()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="lease">
            <PropertyDetailsLeaseTab
                property={data}
                createOpen
                onCreateOpenChange={(open) => {
                    if (!open) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/lease",
                            params: {propertyId},
                            replace: true,
                        })
                    }
                }}
            />
        </PropertyPage>
    )
}
