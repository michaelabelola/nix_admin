import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/$propertyId",
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
