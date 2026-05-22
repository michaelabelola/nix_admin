import {createFileRoute} from "@tanstack/react-router"
import {AddressStepSection} from "#/modules/self/organizations/register/RegistrationStepSections.tsx"

export const Route = createFileRoute("/_authenticated/self/organizations/register/address")({
    component: AddressStepSection,
})
