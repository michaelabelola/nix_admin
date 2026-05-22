import { useNavigate } from "@tanstack/react-router"
import { useForm, useStore } from "@tanstack/react-form"
import { toast } from "sonner"

import { PropertyApiHook } from "@suiteonix/server"
import type { PropertyModel } from "@suiteonix/server"

import {
  RegistrationForm,
  RegistrationImageSelectorField,
} from "./PropertyRegistrationFields.tsx"
import { PropertyRegistrationLayout } from "./PropertyRegistrationLayout.tsx"
import { StepMutationError } from "./PropertyRegistrationFormParts.tsx"
import { getNextPropertyRegistrationStep } from "./property-registration.constants.ts"

type AvatarFormValues = {
  file: File | null
}

export function PropertyAvatarStep({
  property,
}: {
  property: PropertyModel.Detailed
}) {
  const navigate = useNavigate()
  const uploadAvatar = PropertyApiHook.useUploadPropertyAvatar()

  // @ts-ignore
  const form = useForm<AvatarFormValues>({
    defaultValues: {
      file: null,
    },
    onSubmit: async ({ value }) => {
      if (value.file) {
        await uploadAvatar.mutateAsync({
          propertyId: property.id,
          file: value.file,
          part: "avatar",
        })

        toast.success("Property avatar uploaded.")
      } else if (!property.avatar) {
        toast.error("Select an image before continuing.")
        return
      }

      const nextStep = getNextPropertyRegistrationStep("avatar", property.id)
      if (nextStep?.path) {
        await navigate({ to: nextStep.path as any })
      }
    },
  })

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
  const selectedFile = useStore(form.store, (state) => state.values.file)
  const disableNext = !selectedFile && !property.avatar

  return (
    <PropertyRegistrationLayout
      stepId="avatar"
      propertyId={property.id}
      property={property}
      skipHref={getNextPropertyRegistrationStep("avatar", property.id)?.path}
      nextLabel={property.avatar && !selectedFile ? "Continue" : "Upload avatar"}
      disableNext={disableNext}
      isBusy={isSubmitting || uploadAvatar.isPending}
      onNext={() => form.handleSubmit()}
    >
      <RegistrationForm form={form}>
        <RegistrationImageSelectorField
          form={form}
          name="file"
          label="Avatar image"
          description="Upload a square or landscape image for the property's primary visual."
          defaultImageUrl={property.avatar}
          accept="image/*"
        />

        <StepMutationError
          title="Unable to upload avatar"
          message={uploadAvatar.error?.message}
        />
      </RegistrationForm>
    </PropertyRegistrationLayout>
  )
}
