import {createFileRoute, useLocation, useNavigate} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsRentTab} from "#/modules/real-estate/property/details/tabs/rent/PropertyDetailsRentTab.tsx";
import {PropertyApiHook} from "@suiteonix/server";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/rent",
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
    const createOpen = pathname.endsWith("/rent/create")

    return (
        <PropertyPage activeTab="rent">
            <PropertyDetailsRentTab
                property={data}
                createOpen={createOpen}
                onCreateOpenChange={(open) => {
                    if (open) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/rent/create",
                            params: {propertyId},
                        })
                        return
                    }

                    if (createOpen) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/rent",
                            params: {propertyId},
                            replace: true,
                        })
                    }
                }}
            />
        </PropertyPage>
    )
}
