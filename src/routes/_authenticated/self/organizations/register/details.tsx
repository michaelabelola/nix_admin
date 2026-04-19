import {createFileRoute} from "@tanstack/react-router"
import {DetailsStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/details")({
    component: DetailsStepSection,
})
