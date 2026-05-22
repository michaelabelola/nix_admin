import { createFileRoute } from "@tanstack/react-router"

import { PropertyAvatarStep } from "#/modules/real-estate/property/registration/components/PropertyAvatarStep.tsx"
import { PropertyRegistrationGuard } from "#/modules/real-estate/property/registration/components/PropertyRegistrationGuard.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/$propertyId/avatar",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { propertyId } = Route.useParams()

  return (
    <PropertyRegistrationGuard propertyId={propertyId}>
      {(property) => <PropertyAvatarStep property={property} />}
    </PropertyRegistrationGuard>
  )
}
