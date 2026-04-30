import {createFileRoute, Outlet} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/create")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
