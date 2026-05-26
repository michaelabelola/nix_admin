import {createFileRoute} from "@tanstack/react-router"

import {CustomerVerifyEmailPage} from "#/modules/auth/verify-email/CustomerVerifyEmailPage.tsx"

type VerifyEmailSearch = {
    email?: string
    token?: string | number
    autosubmit?: boolean | string
}

function stringSearchValue(value: unknown) {
    if (typeof value === "string") return value
    if (typeof value === "number") return String(value)
    return ""
}

export const Route = createFileRoute("/_landing/verify-email")({
    validateSearch: (search: VerifyEmailSearch) => {
        const autosubmit = search.autosubmit === true || search.autosubmit === "true" || search.autosubmit === ""

        return {
            email: stringSearchValue(search.email),
            token: stringSearchValue(search.token),
            ...(autosubmit ? {autosubmit} : {}),
        }
    },
    component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
    const search = Route.useSearch()

    return (
        <CustomerVerifyEmailPage
            initialEmail={search.email}
            initialToken={search.token}
            autosubmit={search.autosubmit}
        />
    )
}
