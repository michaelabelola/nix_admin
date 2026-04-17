import { createFileRoute } from '@tanstack/react-router'

import { SignInPage } from '#/modules/auth/signin/components/SignInPage'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  return <SignInPage />
}
