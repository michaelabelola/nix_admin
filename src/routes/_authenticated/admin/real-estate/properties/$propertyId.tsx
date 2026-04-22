import { createFileRoute } from "@tanstack/react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/$propertyId",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { propertyId } = Route.useParams()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property detail page</CardTitle>
        <CardDescription>
          Placeholder page for property {propertyId}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-64 rounded-lg border border-dashed" />
      </CardContent>
    </Card>
  )
}
