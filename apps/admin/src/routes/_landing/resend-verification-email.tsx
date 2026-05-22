import {createFileRoute} from '@tanstack/react-router'

import {ResendVerificationEmailPage} from '#/modules/auth/signin/components/ResendVerificationEmailPage.tsx'

export const Route = createFileRoute('/_landing/resend-verification-email')({
    validateSearch: (search: { email?: string }) => ({
        email: typeof search.email === 'string' ? search.email : '',
    }),
    component: ResendVerificationEmailRoute,
})

function ResendVerificationEmailRoute() {
    const search = Route.useSearch()

    return <ResendVerificationEmailPage initialEmail={search.email}/>
}
