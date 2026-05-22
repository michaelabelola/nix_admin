import {createFileRoute} from "@tanstack/react-router"
import {SocialsStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/socials")({
    component: SocialsStepSection,
})
