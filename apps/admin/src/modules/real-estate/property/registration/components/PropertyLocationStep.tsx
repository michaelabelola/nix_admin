import { useEffect } from "react"
import {useNavigate} from "@tanstack/react-router"
import {useForm, useStore} from "@tanstack/react-form"
import {toast} from "sonner"

import {PropertyApiHook} from "@suiteonix/server"
import type {PropertyModel} from "@suiteonix/server"
import {
    LocationPicker,
    type LocationPickerAddress,
    type LocationPickerAddressPatch,
} from "#/modules/location/components/googleLocationPicker/LocationPicker.tsx"

import {
    RegistrationCountryComboboxField,
    RegistrationForm,
    type RegistrationFormLike,
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

type LocationRegistrationForm = RegistrationFormLike & {
    setFieldValue: (field: keyof LocationFormValues, value: string) => void
}

export function PropertyLocationStep({
                                         property,
                                     }: {
    property: PropertyModel.Detailed
}) {
    const navigate = useNavigate()
    const propertyLocationQuery = PropertyApiHook.useGetPropertyAssignedLocation(property.id)
    const addLocationToProperty = PropertyApiHook.useAddLocationToProperty()

    // @ts-ignore
    const form = useForm<LocationFormValues>({
        defaultValues: getLocationFormDefaults(property),
        onSubmit: async ({value}) => {
            await addLocationToProperty.mutateAsync({
                propertyId: property.id,
                body: toLocationCreateBody(value),
            })

            toast.success("Property location saved.")
            const nextStep = getNextPropertyRegistrationStep("location", property.id)
            if (nextStep?.path) {
                await navigate({to: nextStep.path as any})
            }
        },
    })

    useEffect(() => {
        const location = propertyLocationQuery.data
        if (!location) return

        form.setFieldValue("label", location.label ?? "")
        form.setFieldValue("apartment", location.apartment ?? "")
        form.setFieldValue("unit", location.unit ?? "")
        form.setFieldValue("building", location.building ?? "")
        form.setFieldValue("floor", location.floor != null ? String(location.floor) : "")
        form.setFieldValue("line1", location.line1 ?? "")
        form.setFieldValue("line2", location.line2 ?? "")
        form.setFieldValue("city", location.city ?? "")
        form.setFieldValue("state", location.state ?? "")
        form.setFieldValue("postalCode", location.postalCode ?? "")
        form.setFieldValue("country", location.country ?? "")
        form.setFieldValue("latitude", location.latitude != null ? String(location.latitude) : "")
        form.setFieldValue("longitude", location.longitude != null ? String(location.longitude) : "")
        form.setFieldValue("refId", location.ref ?? "")
    }, [form, propertyLocationQuery.data])

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
    const values = useStore(form.store, (state) => state.values)
    const locationPickerValue = toLocationPickerAddress(values)
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
            nextLabel="Save location"
            disableNext={disableNext}
            isBusy={isSubmitting || addLocationToProperty.isPending}
            onNext={() => form.handleSubmit()}
        >
            <RegistrationForm form={form}>
                <div className="grid gap-6 md:grid-cols-2">
                    <LocationPicker
                        value={locationPickerValue}
                        onChange={(patch) => applyLocationPickerPatch(form, patch)}
                    />

                    {LOCATION_FORM_FIELDS.map((field) => (
                        <PropertyLocationInputField key={field.name} form={form} field={field}/>
                    ))}
                </div>

                <StepMutationError
                    title="Unable to save location"
                    message={addLocationToProperty.error?.message || propertyLocationQuery.error?.message}
                />
            </RegistrationForm>
        </PropertyRegistrationLayout>
    )
}

function toLocationPickerAddress(values: LocationFormValues): LocationPickerAddress {
    return {
        apt_number: values.apartment,
        street: values.line1,
        city: values.city,
        state: values.state,
        country: values.country,
        zipcode: values.postalCode,
        latitude: toLocationPickerCoordinate(values.latitude),
        longitude: toLocationPickerCoordinate(values.longitude),
    }
}

function toLocationPickerCoordinate(value: string) {
    const trimmedValue = value.trim()
    const parsedValue = trimmedValue ? Number(trimmedValue) : 0

    return Number.isFinite(parsedValue) ? parsedValue : 0
}

function applyLocationPickerPatch(
    form: LocationRegistrationForm,
    patch: LocationPickerAddressPatch
) {
    if (patch.apt_number !== undefined) {
        form.setFieldValue("apartment", patch.apt_number)
    }

    if (patch.street !== undefined) {
        form.setFieldValue("line1", patch.street)
    }

    if (patch.city !== undefined) {
        form.setFieldValue("city", patch.city)
    }

    if (patch.state !== undefined) {
        form.setFieldValue("state", patch.state)
    }

    if (patch.country !== undefined) {
        form.setFieldValue("country", patch.country)
    }

    if (patch.zipcode !== undefined) {
        form.setFieldValue("postalCode", patch.zipcode)
    }

    if (patch.latitude !== undefined) {
        form.setFieldValue("latitude", String(patch.latitude))
    }

    if (patch.longitude !== undefined) {
        form.setFieldValue("longitude", String(patch.longitude))
    }
}

function PropertyLocationInputField({
                                        form,
                                        field,
                                    }: {
    form: RegistrationFormLike
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
