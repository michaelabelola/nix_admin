import {createFileRoute} from "@tanstack/react-router"
import {LogosStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/logos")({
    component: LogosStepSection,
})
