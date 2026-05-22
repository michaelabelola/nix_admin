import {createFileRoute} from "@tanstack/react-router"
import {AvatarStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/avatar")({
    component: AvatarStepSection,
})
