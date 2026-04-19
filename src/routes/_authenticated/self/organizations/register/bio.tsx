import {createFileRoute} from "@tanstack/react-router"
import {BioStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/bio")({
    component: BioStepSection,
})
