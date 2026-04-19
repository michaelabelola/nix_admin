import {createFileRoute} from '@tanstack/react-router'
import OrgRegistration from "#/modules/self/organizations/register/OrgRegistration.tsx";

export const Route = createFileRoute(
    '/_authenticated/self/organizations/register',
)({
    component: OrgRegistration,
})

