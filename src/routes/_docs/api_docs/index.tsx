import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_docs/api_docs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_docs/api_docs/"!</div>
}
