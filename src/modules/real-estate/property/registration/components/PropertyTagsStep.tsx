import { useNavigate } from "@tanstack/react-router"
import { useForm, useStore } from "@tanstack/react-form"
import { toast } from "sonner"

import { Badge } from "#/components/ui/badge.tsx"
import { PropertyApiHook } from "#/modules/real-estate/property/api.hook.ts"
import type { PropertyModel } from "#/modules/real-estate/property/model.ts"

import {
  RegistrationForm,
  RegistrationTextareaField,
} from "./PropertyRegistrationFields.tsx"
import { PropertyRegistrationLayout } from "./PropertyRegistrationLayout.tsx"
import { StepMutationError, splitTagIds } from "./PropertyRegistrationFormParts.tsx"
import { getNextPropertyRegistrationStep } from "./property-registration.constants.ts"

type TagsFormValues = {
  tagIds: string
}

export function PropertyTagsStep({
  property,
}: {
  property: PropertyModel.Detailed
}) {
  const navigate = useNavigate()
  const addTags = PropertyApiHook.useAddPropertyTags()

  const form = useForm<TagsFormValues>({
    defaultValues: {
      tagIds: property.tags.join(", "),
    },
    onSubmit: async ({ value }) => {
      await addTags.mutateAsync({
        propertyId: property.id,
        tagIds: splitTagIds(value.tagIds),
      })

      toast.success("Property tags saved.")
      const nextStep = getNextPropertyRegistrationStep("tags", property.id)
      if (nextStep?.path) {
        await navigate({ to: nextStep.path as any })
      }
    },
  })

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  return (
    <PropertyRegistrationLayout
      stepId="tags"
      propertyId={property.id}
      property={property}
      skipHref={getNextPropertyRegistrationStep("tags", property.id)?.path}
      nextLabel="Save tags"
      isBusy={isSubmitting || addTags.isPending}
      onNext={() => form.handleSubmit()}
    >
      <RegistrationForm form={form}>
        {property.tags.length > 0 ? (
          <div className="grid gap-3 rounded-lg bg-muted/30 p-4">
            <div className="text-sm font-medium">Existing tags</div>
            <div className="flex flex-wrap gap-2">
              {property.tags.map((tagId) => (
                <Badge key={tagId} variant="secondary">
                  {tagId}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <RegistrationTextareaField
          form={form}
          name="tagIds"
          label="Tag ids"
          description="Enter one or more tag ids separated by commas, spaces, or line breaks."
          placeholder="tag-id-one, tag-id-two"
          rows={8}
        />

        <StepMutationError
          title="Unable to add property tags"
          message={addTags.error?.message}
        />
      </RegistrationForm>
    </PropertyRegistrationLayout>
  )
}
