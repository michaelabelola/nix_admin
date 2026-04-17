import {createFileRoute} from '@tanstack/react-router'

import {VerifyEmailPage} from '#/modules/auth/signin/components/VerifyEmailPage'

type VerifyEmailSearch = {
    email?: string
    token?: string
}

export const Route = createFileRoute('/_landing/verify-email')({
    validateSearch: (search: VerifyEmailSearch) => ({
        email: typeof search.email === 'string' ? search.email : '',
        token: typeof search.token === 'string' ? search.token : '',
    }),
    component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
    const search = Route.useSearch()

    return <VerifyEmailPage initialEmail={search.email} initialToken={search.token}/>
}
