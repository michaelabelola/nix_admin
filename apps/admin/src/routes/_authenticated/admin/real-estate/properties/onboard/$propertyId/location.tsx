import { createFileRoute } from "@tanstack/react-router"

import { PropertyLocationStep } from "#/modules/real-estate/property/registration/components/PropertyLocationStep.tsx"
import { PropertyRegistrationGuard } from "#/modules/real-estate/property/registration/components/PropertyRegistrationGuard.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/$propertyId/location",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { propertyId } = Route.useParams()

  return (
    <PropertyRegistrationGuard propertyId={propertyId}>
      {(property) => <PropertyLocationStep property={property} />}
    </PropertyRegistrationGuard>
  )
}
