import { createFileRoute } from "@tanstack/react-router"

import { PropertyRegistrationGuard } from "#/modules/real-estate/property/registration/components/PropertyRegistrationGuard.tsx"
import { PropertyTagsStep } from "#/modules/real-estate/property/registration/components/PropertyTagsStep.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/$propertyId/tags",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { propertyId } = Route.useParams()

  return (
    <PropertyRegistrationGuard propertyId={propertyId}>
      {(property) => <PropertyTagsStep property={property} />}
    </PropertyRegistrationGuard>
  )
}
