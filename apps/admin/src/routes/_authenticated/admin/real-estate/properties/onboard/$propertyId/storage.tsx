import { createFileRoute } from "@tanstack/react-router"

import { PropertyFilesStorageStep } from "#/modules/real-estate/property/registration/components/PropertyFilesStorageStep.tsx"
import { PropertyRegistrationGuard } from "#/modules/real-estate/property/registration/components/PropertyRegistrationGuard.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/$propertyId/storage",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { propertyId } = Route.useParams()

  return (
    <PropertyRegistrationGuard propertyId={propertyId}>
      {(property) => <PropertyFilesStorageStep property={property} />}
    </PropertyRegistrationGuard>
  )
}
