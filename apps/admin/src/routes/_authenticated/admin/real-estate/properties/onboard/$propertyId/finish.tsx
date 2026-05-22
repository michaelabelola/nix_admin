import { createFileRoute } from "@tanstack/react-router"

import { PropertyFinishStep } from "#/modules/real-estate/property/registration/components/PropertyFinishStep.tsx"
import { PropertyRegistrationGuard } from "#/modules/real-estate/property/registration/components/PropertyRegistrationGuard.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/$propertyId/finish",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { propertyId } = Route.useParams()

  return (
    <PropertyRegistrationGuard propertyId={propertyId}>
      {(property) => <PropertyFinishStep property={property} />}
    </PropertyRegistrationGuard>
  )
}
