import {createFileRoute} from "@tanstack/react-router"
import {OrgUserStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/org-user")({
    component: OrgUserStepSection,
})
