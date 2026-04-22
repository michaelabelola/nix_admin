import { Navigate, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/onboard/$propertyId/",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { propertyId } = Route.useParams()

  return (
    <Navigate
      to="/admin/real-estate/properties/onboard/$propertyId/about"
      params={{ propertyId }}
    />
  )
}
