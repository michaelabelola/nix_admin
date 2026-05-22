import {createFileRoute} from '@tanstack/react-router'
import StartOrgRegistrationSection from "#/modules/self/organizations/register/StartOrgRegistrationSection.tsx";

export const Route = createFileRoute(
    '/_authenticated/self/organizations/register/',
)({
    component: StartOrgRegistrationSection,
})


