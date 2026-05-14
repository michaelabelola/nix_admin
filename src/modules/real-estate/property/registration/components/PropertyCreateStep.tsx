import {useNavigate} from "@tanstack/react-router"
import {useForm, useStore} from "@tanstack/react-form"
import {toast} from "sonner"

import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts"
import {PropertyModel} from "#/modules/real-estate/property/model.ts"

import {
    RegistrationForm,
    RegistrationInputField,
    RegistrationSelectField,
    RegistrationTextareaField,
} from "./PropertyRegistrationFields.tsx"
import {PropertyRegistrationLayout} from "./PropertyRegistrationLayout.tsx"
import {
    StepMutationError,
    required,
    toNullableString,
} from "./PropertyRegistrationFormParts.tsx"
import {getNextPropertyRegistrationStep} from "./property-registration.constants.ts"
import Page from "#/components/Page.tsx";

const PROPERTY_TYPE_OPTIONS = Object.values(PropertyModel.PropertyType)

export function PropertyCreateStep() {
    const navigate = useNavigate()
    const createProperty = PropertyApiHook.useCreateProperty()

    // @ts-ignore
    const form = useForm<PropertyModel.Create>({
        defaultValues: {
            name: "",
            description: "",
            type: PropertyModel.PropertyType.APARTMENT,
        },
        onSubmit: async ({value}) => {
            const created = await createProperty.mutateAsync({
                name: value.name.trim(),
                description: toNullableString(value.description),
                type: value.type,
            })

            toast.success("Property registered. Continue with onboarding.")
            const nextStep = getNextPropertyRegistrationStep("create", created.id)
            await navigate({to: (nextStep?.path ?? `/admin/real-estate/properties/onboard/${created.id}/about`) as any})
        },
    })

    const values = useStore(form.store, (state) => state.values)
    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
    const disableNext = !values.name.trim() || !values.type

    return (
        <Page>
            <PropertyRegistrationLayout
                stepId="create"
                skipHref="/admin/real-estate/properties"
                nextLabel="Create property"
                disableNext={disableNext}
                isBusy={isSubmitting || createProperty.isPending}
                onNext={() => form.handleSubmit()}
            >
                <RegistrationForm form={form}>
                    <div className="grid gap-6 md:grid-cols-2">
                        <RegistrationInputField
                            form={form}
                            name="name"
                            label="Property name"
                            description="The primary name that identifies the property in admin views."
                            placeholder="The Grand Residences"
                            validators={{
                                onChange: ({value}) => required(value, "Property name"),
                            }}
                        />

                        <RegistrationSelectField
                            form={form}
                            name="type"
                            label="Property type"
                            description="Choose the property category before the rest of the onboarding steps."
                            placeholder="Select a property type"
                            options={PROPERTY_TYPE_OPTIONS}
                        />
                    </div>

                    <RegistrationTextareaField
                        form={form}
                        name="description"
                        label="Short description"
                        description="Optional summary text for the property listing."
                        placeholder="A concise summary of the property."
                        rows={5}
                    />

                    <StepMutationError
                        title="Unable to create property"
                        message={createProperty.error?.message}
                    />
                </RegistrationForm>
            </PropertyRegistrationLayout>
        </Page>
    )
}
