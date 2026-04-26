import {Button} from "#/components/ui/button.tsx"

import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {
    StepCountryField,
    StepInput,
    StepSection,
    StepStateField,
} from "../customer-create.fields.tsx"

function AddressFields({
    prefix,
    address,
    onChange,
}: {
    prefix: string
    address: {
        label: string
        line1: string
        line2: string
        city: string
        state: string
        province: string
        postalCode: string
        country: string
        latitude: string
        longitude: string
    }
    onChange: (patch: Partial<typeof address>) => void
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StepInput label={`${prefix} label`} value={address.label} onChange={(value) => onChange({label: value})}/>
            <StepInput label="Address line 1" value={address.line1} onChange={(value) => onChange({line1: value})}/>
            <StepInput label="Address line 2" value={address.line2} onChange={(value) => onChange({line2: value})}/>
            <StepInput label="City" value={address.city} onChange={(value) => onChange({city: value})}/>
            <StepStateField label="State" countryIso2={address.country} value={address.state} onChange={(value) => onChange({state: value})}/>
            <StepInput label="Province / region" value={address.province} onChange={(value) => onChange({province: value})}/>
            <StepInput label="Postal code" value={address.postalCode} onChange={(value) => onChange({postalCode: value})}/>
            <StepCountryField label="Country" value={address.country} onChange={(value) => onChange({country: value})}/>
            <StepInput label="Latitude" value={address.latitude} onChange={(value) => onChange({latitude: value})}/>
            <StepInput label="Longitude" value={address.longitude} onChange={(value) => onChange({longitude: value})}/>
        </div>
    )
}

export function CustomerCreateAddressesStep() {
    const {
        draft,
        updateBillingAddress,
        updateShippingAddress,
        copyBillingToShipping,
    } = useCustomerCreate()

    return (
        <CustomerCreateStepLayout stepId="addresses">
            <StepSection
                title="Billing address"
                description="Use the billing address fields that should be created with the customer."
            >
                <AddressFields
                    prefix="Billing"
                    address={draft.billingAddress}
                    onChange={updateBillingAddress}
                />
            </StepSection>

            <StepSection
                title="Shipping address"
                description="Configure the shipping destination stored on the initial customer record."
            >
                <div className="flex justify-end">
                    <Button type="button" variant="outline" onClick={copyBillingToShipping}>
                        Copy billing address
                    </Button>
                </div>

                <AddressFields
                    prefix="Shipping"
                    address={draft.shippingAddress}
                    onChange={updateShippingAddress}
                />
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
