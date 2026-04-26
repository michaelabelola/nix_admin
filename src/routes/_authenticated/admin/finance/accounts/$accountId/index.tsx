import {Navigate, createFileRoute} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/$accountId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const {accountId} = Route.useParams()

  return (
    <Navigate
      to="/admin/finance/accounts/$accountId/dashboard"
      params={{accountId}}
    />
  )
}
