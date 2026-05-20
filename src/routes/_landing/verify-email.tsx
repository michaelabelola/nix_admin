import {createFileRoute} from '@tanstack/react-router'

import {VerifyEmailPage} from '#/modules/auth/signin/components/VerifyEmailPage'

type VerifyEmailSearch = {
    email?: string
    token?: string
    autosubmit?: boolean | string
}

export const Route = createFileRoute('/_landing/verify-email')({
    validateSearch: (search: VerifyEmailSearch) => {
        return ({
            email: typeof search.email === 'string' ? search.email : '',
            token: typeof search.token === 'string' ? search.token : '',
            autosubmit: search.autosubmit === true || search.autosubmit === 'true' || search.autosubmit === '',
        })
    },
    component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
    const search = Route.useSearch()

    return <VerifyEmailPage initialEmail={search.email} initialToken={search.token} autosubmit={search.autosubmit}/>
}
