import {Textarea} from "#/components/ui/textarea.tsx"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {dateInputValue, TextField} from "./shared.tsx"

export function OrgUserStepSection() {
    const {draft, updateUser, updateUserAddress} = useRegistration()
    const address = draft.user.address
    const isDisabled = !draft.user.firstname.trim() || !draft.user.lastname.trim() || !draft.user.email.trim() || !draft.user.phone.trim() || !address.street.trim() || !address.city.trim() || !address.state.trim() || !address.country.trim() || !address.zipcode.trim()

    return (
        <RegistrationStepLayout stepId="org-user" disableNext={isDisabled}>
            <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="First name" value={draft.user.firstname} onChange={(value) => updateUser({firstname: value})}/>
                    <TextField label="Last name" value={draft.user.lastname} onChange={(value) => updateUser({lastname: value})}/>
                    <TextField label="Email" type="email" value={draft.user.email} onChange={(value) => updateUser({email: value})}/>
                    <TextField label="Phone" type="tel" value={draft.user.phone} onChange={(value) => updateUser({phone: value})}/>
                    <TextField label="Date of birth" type="date" value={dateInputValue(draft.user.dateOfBirth)} onChange={(value) => updateUser({dateOfBirth: value})}/>
                </div>

                <label className="grid gap-2">
                    <span className="text-sm font-medium">Owner bio</span>
                    <Textarea
                        value={draft.user.bio}
                        onChange={(event) => updateUser({bio: event.target.value})}
                        rows={5}
                    />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Apartment / Suite" value={address.apt_number} onChange={(value) => updateUserAddress({apt_number: value})}/>
                    <TextField label="Street" value={address.street} onChange={(value) => updateUserAddress({street: value})}/>
                    <TextField label="City" value={address.city} onChange={(value) => updateUserAddress({city: value})}/>
                    <TextField label="State / Province" value={address.state} onChange={(value) => updateUserAddress({state: value})}/>
                    <TextField label="Country" value={address.country} onChange={(value) => updateUserAddress({country: value})}/>
                    <TextField label="Zip / Postal code" value={address.zipcode} onChange={(value) => updateUserAddress({zipcode: value})}/>
                    <TextField label="Latitude" type="number" value={address.latitude} onChange={(value) => updateUserAddress({latitude: Number(value)})}/>
                    <TextField label="Longitude" type="number" value={address.longitude} onChange={(value) => updateUserAddress({longitude: Number(value)})}/>
                </div>
            </div>
        </RegistrationStepLayout>
    )
}
