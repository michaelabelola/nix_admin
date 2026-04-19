import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

export function AddressStepSection() {
    const {draft, updateDataAddress} = useRegistration()
    const address = draft.data.address
    const isDisabled = !address.street.trim() || !address.city.trim() || !address.state.trim() || !address.country.trim() || !address.zipcode.trim()

    return (
        <RegistrationStepLayout stepId="address" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Apartment / Suite" value={address.apt_number ?? ""} onChange={(value) => updateDataAddress({apt_number: value})}/>
                <TextField label="Street" value={address.street} onChange={(value) => updateDataAddress({street: value})}/>
                <TextField label="City" value={address.city} onChange={(value) => updateDataAddress({city: value})}/>
                <TextField label="State / Province" value={address.state} onChange={(value) => updateDataAddress({state: value})}/>
                <TextField label="Country" value={address.country} onChange={(value) => updateDataAddress({country: value})}/>
                <TextField label="Zip / Postal code" value={address.zipcode} onChange={(value) => updateDataAddress({zipcode: value})}/>
                <TextField label="Latitude" type="number" value={address.latitude} onChange={(value) => updateDataAddress({latitude: Number(value)})}/>
                <TextField label="Longitude" type="number" value={address.longitude} onChange={(value) => updateDataAddress({longitude: Number(value)})}/>
            </div>
        </RegistrationStepLayout>
    )
}
