import {useNavigate} from "@tanstack/react-router"
import {useForm, useStore} from "@tanstack/react-form"
import {toast} from "sonner"

import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts"
import type {PropertyModel} from "#/modules/real-estate/property/model.ts"

import {
    RegistrationCountryComboboxField,
    RegistrationForm,
    RegistrationInputField,
    RegistrationStateComboboxField,
} from "./PropertyRegistrationFields.tsx"
import {PropertyRegistrationLayout} from "./PropertyRegistrationLayout.tsx"
import {
    StepMutationError,
    required,
} from "./PropertyRegistrationFormParts.tsx"
import {getNextPropertyRegistrationStep} from "./property-registration.constants.ts"
import {
    type LocationFieldConfig,
    type LocationFormValues,
    LOCATION_FORM_FIELDS,
    getLocationFormDefaults,
    toLocationCreateBody,
} from "./property-location.form.ts"

export function PropertyLocationStep({
                                         property,
                                     }: {
    property: PropertyModel.Detailed
}) {
    const navigate = useNavigate()
    const createLocation = PropertyApiHook.useCreatePropertyLocation()

    const form = useForm<LocationFormValues>({
        defaultValues: getLocationFormDefaults(property),
        onSubmit: async ({value}) => {
            await createLocation.mutateAsync(toLocationCreateBody(value))

            toast.success("Property location record created.")
            const nextStep = getNextPropertyRegistrationStep("location", property.id)
            if (nextStep?.path) {
                await navigate({to: nextStep.path as any})
            }
        },
    })

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
    const values = useStore(form.store, (state) => state.values)
    const disableNext =
        !values.line1.trim() ||
        !values.city.trim() ||
        !values.state.trim() ||
        !values.country.trim()

    return (
        <PropertyRegistrationLayout
            stepId="location"
            propertyId={property.id}
            property={property}
            skipHref={getNextPropertyRegistrationStep("location", property.id)?.path}
            nextLabel="Create location"
            disableNext={disableNext}
            isBusy={isSubmitting || createLocation.isPending}
            onNext={() => form.handleSubmit()}
        >
            <RegistrationForm form={form}>
                <div className="grid gap-6 md:grid-cols-2">
                    {LOCATION_FORM_FIELDS.map((field) => (
                        <PropertyLocationInputField key={field.name} form={form} field={field}/>
                    ))}
                </div>

                <StepMutationError
                    title="Unable to create location"
                    message={createLocation.error?.message}
                />
            </RegistrationForm>
        </PropertyRegistrationLayout>
    )
}

function PropertyLocationInputField({
                                        form,
                                        field,
                                    }: {
    form: ReturnType<typeof useForm<LocationFormValues>>
    field: LocationFieldConfig
}) {
    if (field.inputKind === "country-combobox") {
        return (
            <RegistrationCountryComboboxField
                form={form}
                name={field.name}
                label={false}
                description={field.description}
                validators={
                    field.required
                        ? {
                            onChange: ({value}) => required(value, field.label),
                        }
                        : undefined
                }
            />
        )
    }

    if (field.inputKind === "state-combobox") {
        return (
            <RegistrationStateComboboxField
                form={form}
                name={field.name}
                countryFieldName="country"
                label={false}
                description={field.description}
                validators={
                    field.required
                        ? {
                            onChange: ({value}) => required(value, field.label),
                        }
                        : undefined
                }
            />
        )
    }

    return (
        <RegistrationInputField
            form={form}
            name={field.name}
            label={field.label}
            description={field.description}
            placeholder={field.placeholder}
            type={field.type}
            validators={
                field.required
                    ? {
                        onChange: ({value}) => required(value, field.label),
                    }
                    : undefined
            }
        />
    )
}
