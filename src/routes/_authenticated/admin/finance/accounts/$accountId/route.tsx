import {createFileRoute, Outlet} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/finance/accounts/$accountId")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
