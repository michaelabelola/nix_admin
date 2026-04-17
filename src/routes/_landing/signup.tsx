import { createFileRoute } from '@tanstack/react-router'

import { SignUpPage } from '#/modules/auth/signup/components/SignUpPage'

export const Route = createFileRoute('/_landing/signup')({
  component: SignUpRoute,
})

function SignUpRoute() {
  return <SignUpPage />
}
