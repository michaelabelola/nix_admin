import { Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import type { PropertyModel } from "#/modules/real-estate/property/model.ts"

import { propertyDetailPath } from "./property-registration.constants.ts"

export function PropertyAlreadyRegisteredCard({
  property,
}: {
  property: Pick<PropertyModel.Detailed, "id" | "name" | "lifecycleStage">
}) {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Property already registered</CardTitle>
        <CardDescription>
          {property.name?.trim() || property.id} is no longer in onboarding. Its
          current lifecycle stage is {property.lifecycleStage ?? "UNKNOWN"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Continue from the property detail page instead of the onboarding flow.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link to={propertyDetailPath(property.id) as any}>Open property</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
