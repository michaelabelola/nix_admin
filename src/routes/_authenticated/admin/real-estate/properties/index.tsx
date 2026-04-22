import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"

export const Route = createFileRoute(
  "/_authenticated/admin/real-estate/properties/",
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>
          Start a new real estate property onboarding flow or jump to the
          location registry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          Property listing and detail management have not been built yet. Use
          onboarding to create a property and move it through the first setup
          steps.
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/admin/real-estate/properties/onboard">
            Onboard a property
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/real-estate/properties/locations">
            View locations
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
