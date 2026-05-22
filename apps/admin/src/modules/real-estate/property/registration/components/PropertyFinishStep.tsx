import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import type { PropertyModel } from "#/modules/real-estate/property/model.ts"
import { PropertyApiHook } from "#/modules/real-estate/property/api.hook.ts"

import { PropertyRegistrationLayout } from "./PropertyRegistrationLayout.tsx"
import { StepMutationError } from "./PropertyRegistrationFormParts.tsx"
import { propertyDetailPath } from "./property-registration.constants.ts"

export function PropertyFinishStep({
  property,
}: {
  property: PropertyModel.Detailed
}) {
  const navigate = useNavigate()
  const finishOnboarding = PropertyApiHook.useFinishPropertyOnboarding()

  const handleFinish = async () => {
    await finishOnboarding.mutateAsync(property.id)
    toast.success("Property onboarding completed.")
    await navigate({ to: propertyDetailPath(property.id) as any })
  }

  return (
    <PropertyRegistrationLayout
      stepId="finish"
      propertyId={property.id}
      property={property}
      skipHref={propertyDetailPath(property.id)}
      nextLabel="Finish onboarding"
      isBusy={finishOnboarding.isPending}
      onNext={() => void handleFinish()}
    >
      <div className="grid gap-6">
        <div className="rounded-lg bg-muted/30 p-5">
          <div className="grid gap-3">
            <div className="text-base font-medium">Ready to finish</div>
            <p className="text-sm text-muted-foreground">
              Finishing onboarding moves this property out of the onboarding stage
              and takes you to the property detail page.
            </p>
          </div>
        </div>

        <StepMutationError
          title="Unable to finish onboarding"
          message={finishOnboarding.error?.message}
        />
      </div>
    </PropertyRegistrationLayout>
  )
}
