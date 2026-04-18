import {createFileRoute} from "@tanstack/react-router"

import {MyBusinessesPage} from "#/modules/self/organizations/my-businesses/MyBusinessesPage.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/")({
  component: MyBusinessesRoute,
})

function MyBusinessesRoute() {
  return <MyBusinessesPage />
}
