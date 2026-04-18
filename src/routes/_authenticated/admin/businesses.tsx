import {createFileRoute} from "@tanstack/react-router"

import {MyBusinessesPage} from "#/modules/admin/user-admin/businesses/MyBusinessesPage.tsx"

export const Route = createFileRoute("/_authenticated/admin/businesses")({
  component: MyBusinessesRoute,
})

function MyBusinessesRoute() {
  return <MyBusinessesPage />
}
