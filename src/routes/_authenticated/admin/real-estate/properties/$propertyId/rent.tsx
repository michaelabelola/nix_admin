import {createFileRoute, useNavigate} from "@tanstack/react-router";

import PropertyPage from "#/modules/real-estate/property/details/PropertyPage.tsx";
import {PropertyDetailsRentTab} from "#/modules/real-estate/property/details/tabs/rent/PropertyDetailsRentTab.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId/rent",
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {propertyId} = Route.useParams()
    const navigate = useNavigate()
    const {data} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <PropertyPage activeTab="rent">
            <PropertyDetailsRentTab
                property={data}
                onCreateOpenChange={(open) => {
                    if (open) {
                        void navigate({
                            to: "/admin/real-estate/properties/$propertyId/rent/create",
                            params: {propertyId},
                        })
                    }
                }}
            />
        </PropertyPage>
    )
}
