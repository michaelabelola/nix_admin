import { useNavigate } from "@tanstack/react-router"
import { useForm, useStore } from "@tanstack/react-form"
import { toast } from "sonner"

import { Badge } from "@suiteonix/ui"
import { PropertyApiHook } from "@suiteonix/server"
import type { PropertyModel } from "@suiteonix/server"
import {TagPicker} from "#/modules/tags/components/TagPicker.tsx"

import {
  RegistrationForm,
} from "./PropertyRegistrationFields.tsx"
import { PropertyRegistrationLayout } from "./PropertyRegistrationLayout.tsx"
import { StepField, StepMutationError } from "./PropertyRegistrationFormParts.tsx"
import { getNextPropertyRegistrationStep } from "./property-registration.constants.ts"

type TagsFormValues = {
  tagIds: string[]
}

export function PropertyTagsStep({
  property,
}: {
  property: PropertyModel.Detailed
}) {
  const navigate = useNavigate()
  const addTags = PropertyApiHook.useAddPropertyTags()

  // @ts-ignore
  const form = useForm<TagsFormValues>({
    defaultValues: {
      tagIds: property.tags,
    },
    onSubmit: async ({ value }) => {
      await addTags.mutateAsync({
        propertyId: property.id,
        tagIds: value.tagIds,
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

        <form.Field name="tagIds">
          {(field: any) => (
            <StepField
              label="Tags"
              description="Search by name or id, narrow results by module and type, then select the tags that should classify this property."
            >
              <TagPicker
                value={field.state.value ?? []}
                onChange={field.handleChange}
                disabled={isSubmitting || addTags.isPending}
              />
            </StepField>
          )}
        </form.Field>

        <StepMutationError
          title="Unable to add property tags"
          message={addTags.error?.message}
        />
      </RegistrationForm>
    </PropertyRegistrationLayout>
  )
}
