import {MapPinned} from "lucide-react"

import {
    LocationPicker,
    type LocationPickerAddress,
    type LocationPickerAddressPatch,
} from "@suiteonix/components"
import {
    StepCountryField,
    StepInput,
    StepSection, StepStateField,
    StepSwitch,
} from "../customer-create.fields.tsx"

import {useCustomerRegister} from "../customer-register.context.tsx"
import type {RegisterAddressDraft} from "../customer-register.types.ts"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"

function toPickerCoordinate(value: string) {
    const parsed = Number(value.trim())
    return Number.isFinite(parsed) ? parsed : 0
}

function toLocationPickerAddress(address: RegisterAddressDraft): LocationPickerAddress {
    return {
        apt_number: "",
        street: address.line1,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.postalCode,
        latitude: toPickerCoordinate(address.latitude),
        longitude: toPickerCoordinate(address.longitude),
    }
}

function toAddressPatch(patch: LocationPickerAddressPatch): Partial<RegisterAddressDraft> {
    const nextPatch: Partial<RegisterAddressDraft> = {}

    if (patch.street !== undefined) nextPatch.line1 = patch.street
    if (patch.city !== undefined) nextPatch.city = patch.city
    if (patch.state !== undefined) nextPatch.state = patch.state
    if (patch.country !== undefined) nextPatch.country = patch.country
    if (patch.zipcode !== undefined) nextPatch.postalCode = patch.zipcode
    if (patch.latitude !== undefined) nextPatch.latitude = String(patch.latitude)
    if (patch.longitude !== undefined) nextPatch.longitude = String(patch.longitude)

    return nextPatch
}

function AddressFields({
    address,
    onChange,
}: {
    address: RegisterAddressDraft
    onChange: (patch: Partial<RegisterAddressDraft>) => void
}) {
    return (
        <div className="grid gap-4">
            <LocationPicker
                value={toLocationPickerAddress(address)}
                onChange={(patch) => onChange(toAddressPatch(patch))}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <StepInput label="Label" value={address.label} onChange={(value) => onChange({label: value})}/>
                <StepInput label="Address line 1" value={address.line1} onChange={(value) => onChange({line1: value})}/>
                <StepInput label="City" value={address.city} onChange={(value) => onChange({city: value})}/>
                <StepStateField label="State" countryIso2={address.country} value={address.state} onChange={(value) => onChange({state: value})}/>
                <StepInput label="Province / region" value={address.province} onChange={(value) => onChange({province: value})}/>
                <StepInput label="Postal code" value={address.postalCode} onChange={(value) => onChange({postalCode: value})}/>
                <StepCountryField label="Country" value={address.country} onChange={(value) => onChange({country: value})}/>
                <StepInput label="Latitude" value={address.latitude} onChange={(value) => onChange({latitude: value})}/>
                <StepInput label="Longitude" value={address.longitude} onChange={(value) => onChange({longitude: value})}/>
            </div>
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
