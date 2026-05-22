import { createFileRoute } from "@tanstack/react-router"

import { PropertyCreateStep } from "#/modules/real-estate/property/registration/components/PropertyCreateStep.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/",
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <PropertyCreateStep />
}
