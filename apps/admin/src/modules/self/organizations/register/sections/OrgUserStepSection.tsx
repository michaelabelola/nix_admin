import {useEffect, useRef} from "react"

import {DatePicker, parseDateInput, toDateInputValue} from "#/components/ui/date-picker.tsx"
import {Textarea} from "#/components/ui/textarea.tsx"
import {CountryCombobox} from "#/modules/location/components/CountryCombobox.tsx"
import {StateCombobox} from "#/modules/location/components/StateCombobox.tsx"
import {UserRequest} from "#/modules/user/api.hook.tsx"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {dateInputValue, TextField} from "./shared.tsx"

const BIRTH_DATE_START = new Date(1900, 0, 1)

export function OrgUserStepSection() {
    const {draft, updateUser, updateUserAddress} = useRegistration()
    const {data: authenticatedUser} = UserRequest.useGetAuthenticatedUser()
    const didPrefill = useRef(false)
    const address = draft.user.address
    const today = new Date()
    const dateOfBirth = parseDateInput(dateInputValue(draft.user.dateOfBirth))
    const isDisabled = !draft.user.firstname.trim() || !draft.user.lastname.trim() || !draft.user.email.trim() || !draft.user.phone.trim() || !address.street.trim() || !address.city.trim() || !address.state.trim() || !address.country.trim() || !address.zipcode.trim()

    useEffect(() => {
        if (didPrefill.current || !authenticatedUser?.id) return

        didPrefill.current = true
        updateUser({
            firstname: authenticatedUser.firstname ?? "",
            lastname: authenticatedUser.lastname ?? "",
            email: authenticatedUser.email ?? "",
            phone: authenticatedUser.phone ?? "",
            dateOfBirth: authenticatedUser.dateOfBirth ?? "",
            bio: authenticatedUser.bio ?? "",
        })
        updateUserAddress({
            apt_number: authenticatedUser.address?.apt_number ?? "",
            street: authenticatedUser.address?.street ?? "",
            city: authenticatedUser.address?.city ?? "",
            state: authenticatedUser.address?.state ?? "",
            country: authenticatedUser.address?.country ?? "",
            zipcode: authenticatedUser.address?.zipcode ?? "",
            latitude: authenticatedUser.address?.latitude ?? 0,
            longitude: authenticatedUser.address?.longitude ?? 0,
        })
    }, [authenticatedUser, updateUser, updateUserAddress])

    return (
        <RegistrationStepLayout stepId="org-user" disableNext={isDisabled}>
            <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="First name" value={draft.user.firstname} onChange={(value) => updateUser({firstname: value})}/>
                    <TextField label="Last name" value={draft.user.lastname} onChange={(value) => updateUser({lastname: value})}/>
                    <TextField label="Email" type="email" value={draft.user.email} onChange={(value) => updateUser({email: value})}/>
                    <TextField label="Phone" type="tel" value={draft.user.phone} onChange={(value) => updateUser({phone: value})}/>
                    <label className="grid gap-2">
                        <span className="text-sm font-medium">Date of birth</span>
                        <DatePicker
                            value={dateOfBirth}
                            placeholder="Pick a date"
                            captionLayout="dropdown"
                            startMonth={BIRTH_DATE_START}
                            endMonth={today}
                            disabled={(date) => date > today || date < BIRTH_DATE_START}
                            onChange={(date) => {
                                if (!date) return

                                updateUser({dateOfBirth: toDateInputValue(date)})
                            }}
                        />
                    </label>
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
                    <CountryCombobox
                        value={address.country}
                        onValueChange={(value) => updateUserAddress({country: value, state: ""})}
                    />
                    <StateCombobox
                        countryIso2={address.country}
                        value={address.state}
                        onValueChange={(value) => updateUserAddress({state: value})}
                    />
                    <TextField label="Zip / Postal code" value={address.zipcode} onChange={(value) => updateUserAddress({zipcode: value})}/>
                    <TextField label="Latitude" type="number" value={address.latitude} onChange={(value) => updateUserAddress({latitude: Number(value)})}/>
                    <TextField label="Longitude" type="number" value={address.longitude} onChange={(value) => updateUserAddress({longitude: Number(value)})}/>
                </div>
            </div>
        </RegistrationStepLayout>
    )
}
