import { createFileRoute } from "@tanstack/react-router"

import { PropertyAboutStep } from "#/modules/real-estate/property/registration/components/PropertyAboutStep.tsx"
import { PropertyRegistrationGuard } from "#/modules/real-estate/property/registration/components/PropertyRegistrationGuard.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/$propertyId/about",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { propertyId } = Route.useParams()

  return (
    <PropertyRegistrationGuard propertyId={propertyId}>
      {(property) => <PropertyAboutStep property={property} />}
    </PropertyRegistrationGuard>
  )
}
