import {createFileRoute} from "@tanstack/react-router"

import PublicOrgProfilePage from "#/modules/organization/PublicOrgProfilePage.tsx"

export const Route = createFileRoute("/_authenticated/admin/public-profile")({
    component: PublicOrgProfilePage,
})
