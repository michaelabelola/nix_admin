import {Navigate, createFileRoute} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/finance/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to="/admin/finance/dashboard"/>
}
