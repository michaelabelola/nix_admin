import {createFileRoute} from "@tanstack/react-router"
import {ContactStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/contact")({
    component: ContactStepSection,
})
