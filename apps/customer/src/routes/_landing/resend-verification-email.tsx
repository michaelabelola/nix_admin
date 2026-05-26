import {createFileRoute} from "@tanstack/react-router"

import {CustomerResendVerificationEmailPage} from "#/modules/auth/verify-email/CustomerResendVerificationEmailPage.tsx"

export const Route = createFileRoute("/_landing/resend-verification-email")({
    validateSearch: (search: { email?: string }) => ({
        email: typeof search.email === "string" ? search.email : "",
    }),
    component: ResendVerificationEmailRoute,
})

function ResendVerificationEmailRoute() {
    const search = Route.useSearch()

    return <CustomerResendVerificationEmailPage initialEmail={search.email}/>
}
