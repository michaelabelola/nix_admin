import { useNavigate } from "@tanstack/react-router"
import { useForm, useStore } from "@tanstack/react-form"
import { toast } from "sonner"

import { Badge } from "#/components/ui/badge.tsx"
import { PropertyApiHook } from "#/modules/real-estate/property/api.hook.ts"
import type { PropertyModel } from "#/modules/real-estate/property/model.ts"

import { PropertyRegistrationLayout } from "./PropertyRegistrationLayout.tsx"
import { StepMutationError } from "./PropertyRegistrationFormParts.tsx"
import { getNextPropertyRegistrationStep } from "./property-registration.constants.ts"

type StorageFormValues = {
  confirmed: boolean
}

export function PropertyFilesStorageStep({
  property,
}: {
  property: PropertyModel.Detailed
}) {
  const navigate = useNavigate()
  const initializeStorage = PropertyApiHook.useInitializePropertyFilesStorage()

  const form = useForm<StorageFormValues>({
    defaultValues: {
      confirmed: Boolean(property.storageID),
    },
    onSubmit: async () => {
      if (!property.storageID) {
        await initializeStorage.mutateAsync(property.id)
        toast.success("Property file storage initialized.")
      }

      const nextStep = getNextPropertyRegistrationStep("storage", property.id)
      if (nextStep?.path) {
        await navigate({ to: nextStep.path as any })
      }
    },
  })

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  return (
    <PropertyRegistrationLayout
      stepId="storage"
      propertyId={property.id}
      property={property}
      nextLabel={property.storageID ? "Continue" : "Initialize file storage"}
      isBusy={isSubmitting || initializeStorage.isPending}
      onNext={() => form.handleSubmit()}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-base font-medium">Files storage activation</div>
            <Badge variant={property.storageID ? "secondary" : "outline"}>
              {property.storageID ? "Active" : "Not active"}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Activating a file storage creates the dedicated storage profile used
            for property documents, media, and future uploads. Once active, the
            property can reuse that storage id across the rest of the workflow.
          </p>
          {property.storageID ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Current storage id: {String(property.storageID)}
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
