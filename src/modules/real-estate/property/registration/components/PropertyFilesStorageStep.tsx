import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { Badge } from "#/components/ui/badge.tsx"
import { Button } from "#/components/ui/button.tsx"
import { PropertyApiHook } from "#/modules/real-estate/property/api.hook.ts"
import type { PropertyModel } from "#/modules/real-estate/property/model.ts"

import { PropertyRegistrationLayout } from "./PropertyRegistrationLayout.tsx"
import { StepMutationError } from "./PropertyRegistrationFormParts.tsx"
import { getNextPropertyRegistrationStep } from "./property-registration.constants.ts"

export function PropertyFilesStorageStep({
  property,
}: {
  property: PropertyModel.Detailed
}) {
  const navigate = useNavigate()
  const initializeStorage = PropertyApiHook.useInitializePropertyFilesStorage()
  const [storageId, setStorageId] = useState(property.storageID)

  const handleInitializeStorage = async () => {
    if (storageId) return

    const updatedProperty = await initializeStorage.mutateAsync(property.id)
    setStorageId(updatedProperty.storageID)
    toast.success("Property file storage initialized.")
  }

  const handleNext = async () => {
    const nextStep = getNextPropertyRegistrationStep("storage", property.id)
    if (nextStep?.path) {
      await navigate({ to: nextStep.path as any })
    }
  }

  const isInitialized = Boolean(storageId)

  return (
    <PropertyRegistrationLayout
      stepId="storage"
      propertyId={property.id}
      property={{ ...property, storageID: storageId }}
      secondaryAction={
        <Button
          variant="ghost"
          type="button"
          disabled={initializeStorage.isPending}
          onClick={() => void handleNext()}
        >
          Skip
        </Button>
      }
      nextLabel="Next"
      isBusy={false}
      onNext={() => void handleNext()}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-base font-medium">Files storage activation</div>
            <Badge variant={isInitialized ? "secondary" : "outline"}>
              {isInitialized ? "Active" : "Not active"}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Activating a file storage creates the dedicated storage profile used
            for property documents, media, and future uploads. Once active, the
            property can reuse that storage id across the rest of the workflow.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {isInitialized ? (
              <Button type="button" variant="secondary" disabled>
                Initialized
              </Button>
            ) : (
              <Button
                type="button"
                disabled={initializeStorage.isPending}
                onClick={() => void handleInitializeStorage()}
              >
                Initialize file storage
              </Button>
            )}
          </div>
          {isInitialized ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Current storage id: {String(storageId)}
            </p>
          ) : null}
        </div>

        <StepMutationError
          title="Unable to initialize file storage"
          message={initializeStorage.error?.message}
        />
      </div>
    </PropertyRegistrationLayout>
  )
}
