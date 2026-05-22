import type {Organization_RegisterModel} from "@suiteonix/server"
import {CountryCombobox} from "#/modules/location/components/CountryCombobox.tsx"
import {LocationPicker} from "#/modules/location/components/googleLocationPicker/LocationPicker.tsx"
import {StateCombobox} from "#/modules/location/components/StateCombobox.tsx"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

type RegistrationAddress = Organization_RegisterModel.Register["address"]
type RegistrationAddressPatch = Partial<RegistrationAddress>

const REQUIRED_ADDRESS_FIELDS: Array<keyof Pick<RegistrationAddress, "street" | "city" | "state" | "country" | "zipcode">> = [
    "street",
    "city",
    "state",
    "country",
    "zipcode",
]

export function AddressStepSection() {
    const {draft, updateDataAddress} = useRegistration()
    const address = draft.data.address

    return (
        <RegistrationStepLayout stepId="address" disableNext={isAddressIncomplete(address)}>
            <div className="grid gap-4 md:grid-cols-2">
                <LocationPicker value={address} onChange={updateDataAddress}/>
                <AddressFields address={address} onChange={updateDataAddress}/>
            </div>
        </RegistrationStepLayout>
    )
}

function AddressFields({
                           address,
                           onChange,
                       }: {
    address: RegistrationAddress
    onChange: (patch: RegistrationAddressPatch) => void
}) {
    return (
        <>
            <TextField label="Apartment / Suite" value={address.apt_number ?? ""} onChange={(value) => onChange({apt_number: value})}/>
            <TextField label="Street" value={address.street} onChange={(value) => onChange({street: value})}/>
            <TextField label="City" value={address.city} onChange={(value) => onChange({city: value})}/>
            <CountryCombobox
                value={address.country}
                onValueChange={(value) => onChange({country: value, state: ""})}
            />
            <StateCombobox
                countryIso2={address.country}
                value={address.state}
                onValueChange={(value) => onChange({state: value})}
            />
            <TextField label="Zip / Postal code" value={address.zipcode} onChange={(value) => onChange({zipcode: value})}/>
            <TextField label="Latitude" type="number" value={address.latitude} onChange={(value) => onChange({latitude: Number(value)})}/>
            <TextField label="Longitude" type="number" value={address.longitude} onChange={(value) => onChange({longitude: Number(value)})}/>
        </>
    )
}

function isAddressIncomplete(address: RegistrationAddress) {
    return REQUIRED_ADDRESS_FIELDS.some((field) => !address[field].trim())
}
