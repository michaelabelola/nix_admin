import { useNavigate } from "@tanstack/react-router"
import { useForm, useStore } from "@tanstack/react-form"
import { toast } from "sonner"

import { PropertyApiHook } from "#/modules/real-estate/property/api.hook.ts"
import type { PropertyModel } from "#/modules/real-estate/property/model.ts"

import {
  RegistrationForm,
  RegistrationTextareaField,
} from "./PropertyRegistrationFields.tsx"
import { PropertyRegistrationLayout } from "./PropertyRegistrationLayout.tsx"
import {
  StepMutationError,
  required,
  toNullableString,
} from "./PropertyRegistrationFormParts.tsx"
import { getNextPropertyRegistrationStep } from "./property-registration.constants.ts"

type AboutFormValues = {
  about: string
}

export function PropertyAboutStep({
  property,
}: {
  property: PropertyModel.Detailed
}) {
  const navigate = useNavigate()
  const updateProperty = PropertyApiHook.useUpdateProperty()

  const form = useForm<AboutFormValues>({
    defaultValues: {
      about: property.about ?? "",
    },
    onSubmit: async ({ value }) => {
      await updateProperty.mutateAsync({
        propertyId: property.id,
        body: {
          about: toNullableString(value.about),
        },
      })

      toast.success("Property about section updated.")
      const nextStep = getNextPropertyRegistrationStep("about", property.id)
      if (nextStep?.path) {
        await navigate({ to: nextStep.path as any })
      }
    },
  })

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
  const aboutValue = useStore(form.store, (state) => state.values.about)

  return (
    <PropertyRegistrationLayout
      stepId="about"
      propertyId={property.id}
      property={property}
      nextLabel="Save about"
      disableNext={!aboutValue.trim()}
      isBusy={isSubmitting || updateProperty.isPending}
      onNext={() => form.handleSubmit()}
    >
      <RegistrationForm form={form}>
        <RegistrationTextareaField
          form={form}
          name="about"
          label="About the property"
          description="Use this long-form content to describe the property in more detail."
          placeholder="Describe the neighborhood, experience, amenities, and positioning."
          rows={10}
          validators={{
            onChange: ({ value }) => required(value, "About"),
          }}
        />

        <StepMutationError
          title="Unable to update property"
          message={updateProperty.error?.message}
        />
      </RegistrationForm>
    </PropertyRegistrationLayout>
  )
}
