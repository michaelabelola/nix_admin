import {createFileRoute} from '@tanstack/react-router'

import {ResendVerificationEmailPage} from '#/modules/auth/signin/components/ResendVerificationEmailPage'

export const Route = createFileRoute('/_landing/resend-verification-email')({
    component: ResendVerificationEmailRoute,
})

function ResendVerificationEmailRoute() {
    return <ResendVerificationEmailPage/>
}
