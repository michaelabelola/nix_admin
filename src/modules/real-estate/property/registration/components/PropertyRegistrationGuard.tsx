import type { ReactNode } from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import { Spinner } from "#/components/ui/spinner.tsx"
import { PropertyApiHook } from "#/modules/real-estate/property/api.hook.ts"
import { PropertyModel } from "#/modules/real-estate/property/model.ts"

import { PropertyAlreadyRegisteredCard } from "./PropertyAlreadyRegisteredCard.tsx"

export function PropertyRegistrationGuard({
  propertyId,
  children,
}: {
  propertyId: string
  children: (property: PropertyModel.Detailed) => ReactNode
}) {
  const propertyQuery = PropertyApiHook.useGetDetailedProperty(propertyId)

  if (propertyQuery.isLoading) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Spinner />
            Loading property
          </CardTitle>
          <CardDescription>
            Fetching the detailed property record for onboarding.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (propertyQuery.isError || !propertyQuery.data) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Unable to load property</CardTitle>
          <CardDescription>
            {propertyQuery.error?.message ||
              "The requested property could not be resolved."}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (
    propertyQuery.data.lifecycleStage !== PropertyModel.PropertyLifecycleStage.ONBOARDING
  ) {
    return <PropertyAlreadyRegisteredCard property={propertyQuery.data} />
  }

  return <>{children(propertyQuery.data)}</>
}
