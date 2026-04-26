import {createFileRoute} from '@tanstack/react-router'

import {VerifyEmailPage} from '#/modules/auth/signin/components/VerifyEmailPage'

type VerifyEmailSearch = {
    email?: string
    token?: string
    success?: boolean
}

export const Route = createFileRoute('/_landing/verify-email')({
    validateSearch: (search: VerifyEmailSearch) => {
        return ({
            email: typeof search.email === 'string' ? search.email : '',
            token: typeof search.token === 'string' ? search.token : '',
            success: (typeof search.success === 'boolean' && search.success)
        })
    },
    component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
    const search = Route.useSearch()

    return <VerifyEmailPage initialEmail={search.email} initialToken={search.token} initialSuccess={search.success}/>
}
