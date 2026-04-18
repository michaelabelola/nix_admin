import {createFileRoute} from "@tanstack/react-router"

import {MyBusinessesPage} from "#/modules/admin/user-admin/organizations/MyBusinessesPage.tsx"

export const Route = createFileRoute("/_authenticated/admin/organizations/")({
  component: MyBusinessesRoute,
})

function MyBusinessesRoute() {
  return <MyBusinessesPage />
}
