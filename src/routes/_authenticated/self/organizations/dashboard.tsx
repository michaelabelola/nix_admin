import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/self/organizations/dashboard',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/admin/organizations/dashboard"!</div>
}
