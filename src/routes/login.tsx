import { createFileRoute } from '@tanstack/react-router'

import { AuthPage } from '#/modules/auth/components/AuthPage'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  return <AuthPage />
}
