import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Badge } from "#/components/ui/badge.tsx"
import { Button } from "#/components/ui/button.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import type { PropertyModel } from "#/modules/real-estate/property/model.ts"

import {
  type PropertyRegistrationStepID,
  getNextPropertyRegistrationStep,
  getPreviousPropertyRegistrationStep,
  getPropertyRegistrationStep,
} from "./property-registration.constants.ts"
import { PropertyRegistrationSidebar } from "./PropertyRegistrationSidebar.tsx"

export function PropertyRegistrationLayout({
  stepId,
  propertyId,
  property,
  children,
  secondaryAction,
  nextHref,
  nextLabel = "Continue",
  disableNext = false,
  isBusy = false,
  onNext,
}: {
  stepId: PropertyRegistrationStepID
  propertyId?: string
  property?: Pick<
    PropertyModel.Detailed,
    "id" | "name" | "type" | "lifecycleStage" | "storageID" | "tags"
  >
  children: ReactNode
  secondaryAction?: ReactNode
  nextHref?: string
  nextLabel?: string
  disableNext?: boolean
  isBusy?: boolean
  onNext?: () => void | Promise<void>
}) {
  const step = getPropertyRegistrationStep(stepId, propertyId)
  const previousStep = getPreviousPropertyRegistrationStep(stepId, propertyId)
  const nextStep = getNextPropertyRegistrationStep(stepId, propertyId)

  if (!step) return null

  const resolvedBackHref =
    previousStep?.path ?? "/admin/real-estate/properties"
  const resolvedNextHref = nextHref ?? nextStep?.path

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <PropertyRegistrationSidebar
        stepId={stepId}
        propertyId={propertyId}
        property={property}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{step.shortLabel}</Badge>
          </div>
          <CardTitle>{step.label}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {children}

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" asChild>
              <Link to={resolvedBackHref as any}>
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {secondaryAction}

              {onNext ? (
                <Button type="button" disabled={disableNext || isBusy} onClick={() => void onNext()}>
                  {nextLabel}
                  <ArrowRight className="size-4" />
                </Button>
              ) : resolvedNextHref ? (
                <Button asChild type="button" disabled={disableNext || isBusy}>
                  <Link to={resolvedNextHref as any}>
                    {nextLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
