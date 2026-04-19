import {createFileRoute} from "@tanstack/react-router"
import {IndustryStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/industry")({
    component: IndustryStepSection,
})
