import {createFileRoute} from '@tanstack/react-router'

import {VerifyEmailPage} from '#/modules/auth/signin/components/VerifyEmailPage.tsx'

type VerifyEmailSearch = {
    email?: string
    token?: string | number
    autosubmit?: boolean | string
}

function stringSearchValue(value: unknown) {
    if (typeof value === 'string') {
        return value
    }

    if (typeof value === 'number') {
        return String(value)
    }

    return ''
}

export const Route = createFileRoute('/_landing/verify-email')({
    validateSearch: (search: VerifyEmailSearch) => {
        return ({
            email: stringSearchValue(search.email),
            token: stringSearchValue(search.token),
            autosubmit: search.autosubmit === true || search.autosubmit === 'true' || search.autosubmit === '',
        })
    },
    component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
    const search = Route.useSearch()

    return <VerifyEmailPage initialEmail={search.email} initialToken={search.token} autosubmit={search.autosubmit}/>
}
