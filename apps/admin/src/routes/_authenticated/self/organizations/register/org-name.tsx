import {createFileRoute} from "@tanstack/react-router"
import {OrgNameStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/org-name")({
    component: OrgNameStepSection,
})
