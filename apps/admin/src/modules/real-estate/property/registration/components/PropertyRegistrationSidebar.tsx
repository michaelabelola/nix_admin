import { Link } from "@tanstack/react-router"
import { CheckCircle2 } from "lucide-react"

import { Badge } from "#/components/ui/badge.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import type { PropertyModel } from "#/modules/real-estate/property/model.ts"

import type { PropertyRegistrationStepID } from "./property-registration.constants.ts"
import { getPropertyRegistrationSteps } from "./property-registration.constants.ts"

export function PropertyRegistrationSidebar({
  stepId,
  propertyId,
  property,
}: {
  stepId: PropertyRegistrationStepID
  propertyId?: string
  property?: Pick<
    PropertyModel.Detailed,
    "id" | "name" | "type" | "lifecycleStage" | "storageID"
  >
}) {
  const steps = getPropertyRegistrationSteps(propertyId)
  const currentIndex = steps.findIndex((item) => item.id === stepId)

  return (
    <Card className="h-fit">
      <CardHeader className="space-y-4">
        <div className="space-y-1">
          <CardTitle>Property Onboarding</CardTitle>
          <CardDescription>
            Move through each setup step using the route-backed flow.
          </CardDescription>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="text-sm font-medium">
            {property?.name?.trim() || "New property"}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {property?.id ?? "Property id will be assigned after creation."}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {property?.type ? <Badge variant="secondary">{property.type}</Badge> : null}
            {property?.lifecycleStage ? (
              <Badge variant="outline">{property.lifecycleStage}</Badge>
            ) : null}
            {property?.storageID ? (
              <Badge variant="outline">Storage active</Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {steps.map((item, index) => (
          <PropertyRegistrationStepItem
            key={item.id}
            item={item}
            isActive={item.id === stepId}
            isComplete={index < currentIndex}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function PropertyRegistrationStepItem({
  item,
  isActive,
  isComplete,
}: {
  item: ReturnType<typeof getPropertyRegistrationSteps>[number]
  isActive: boolean
  isComplete: boolean
}) {
  const content = (
    <>
      <div
        className={`mt-0.5 rounded-full border p-1 ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {isComplete ? (
          <CheckCircle2 className="size-3.5 text-primary" />
        ) : (
          <item.icon className="size-3.5" />
        )}
      </div>
      <div className="space-y-1">
        <div className="font-medium">{item.label}</div>
        <div className="text-muted-foreground">{item.description}</div>
      </div>
    </>
  )

  const className = `flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
    isActive ? "border-primary bg-primary/5" : "hover:bg-muted/40"
  } ${item.path ? "" : "cursor-not-allowed opacity-60"}`

  if (!item.path) {
    return <div className={className}>{content}</div>
  }

  return (
    <Link to={item.path as any} className={className}>
      {content}
    </Link>
  )
}
