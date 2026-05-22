import {createFileRoute, useLocation, useNavigate} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsLeaseTab} from "#/modules/real-estate/property/details/tabs/lease/PropertyDetailsLeaseTab.tsx";
import {PropertyApiHook} from "@suiteonix/server";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/lease",
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
    const createOpen = pathname.endsWith("/lease/create")

    return (
        <PropertyPage activeTab="lease">
            <PropertyDetailsLeaseTab
                property={data}
                createOpen={createOpen}
                onCreateOpenChange={(open) => {
                    if (open) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/lease/create",
                            params: {propertyId},
                        })
                        return
                    }

                    if (createOpen) {
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
