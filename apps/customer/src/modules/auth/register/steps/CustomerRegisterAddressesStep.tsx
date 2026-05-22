import {MapPinned} from "lucide-react"

import {
    StepCountryField,
    StepInput,
    StepSection,
    StepStateField,
    StepSwitch,
} from "@suiteonix/admin/src/modules/customer/create/customer-create.fields.tsx"

import {useCustomerRegister} from "../customer-register.context.tsx"
import type {RegisterAddressDraft} from "../customer-register.types.ts"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"

function AddressFields({
    address,
    onChange,
}: {
    address: RegisterAddressDraft
    onChange: (patch: Partial<RegisterAddressDraft>) => void
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StepInput label="Label" value={address.label} onChange={(value) => onChange({label: value})}/>
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

export function CustomerRegisterAddressesStep() {
    const {
        draft,
        updateDraft,
        updateBillingAddress,
        updateShippingAddress,
    } = useCustomerRegister()

    return (
        <CustomerRegisterStepLayout>
            <RegisterStepInsight icon={MapPinned} title="Addresses can be simple">
                Use only the fields that matter for your account. Location coordinates are optional and can be left blank.
            </RegisterStepInsight>

            <StepSection title="Billing address" description="Optional billing address stored on the customer profile.">
                <AddressFields address={draft.billingAddress} onChange={updateBillingAddress}/>
            </StepSection>

            <StepSection title="Shipping address" description="Use billing as shipping or provide a separate destination.">
                <StepSwitch
                    label="Shipping address is the same as billing"
                    checked={draft.sameAsBillingAddress}
                    onCheckedChange={(sameAsBillingAddress) => updateDraft({sameAsBillingAddress})}
                />

                {!draft.sameAsBillingAddress ? (
                    <AddressFields address={draft.shippingAddress} onChange={updateShippingAddress}/>
                ) : null}
            </StepSection>
        </CustomerRegisterStepLayout>
    )
}
