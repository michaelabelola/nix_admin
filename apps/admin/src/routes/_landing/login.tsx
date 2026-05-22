import {createFileRoute} from '@tanstack/react-router'

import {SignInPage} from '#/modules/auth/signin/components/SignInPage.tsx'

export const Route = createFileRoute('/_landing/login')({
    validateSearch: (search: { email?: string }) => ({
        email: typeof search.email === 'string' ? search.email : '',
    }),
    component: LoginRoute,
})

function LoginRoute() {
    const search = Route.useSearch()

    return <SignInPage initialEmail={search.email}/>
}
