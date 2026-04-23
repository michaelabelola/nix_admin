import {createFileRoute} from "@tanstack/react-router"

import PropertyDetailsPage from "#/modules/real-estate/property/details/PropertyDetailsPage.tsx";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/properties/$propertyId",
)({
    component: PropertyDetailsPage,
})
