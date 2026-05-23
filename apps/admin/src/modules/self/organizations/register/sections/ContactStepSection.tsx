import {PhoneNumberInput} from "#/modules/location/components/PhoneNumberInput.tsx"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

export function ContactStepSection() {
    const {draft, updateDataContact} = useRegistration()
    const isDisabled = !draft.data.mainContact.email.trim() || !draft.data.mainContact.phone.trim()

    return (
        <RegistrationStepLayout stepId="mainContact" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Organization email" type="email" value={draft.data.mainContact.email} onChange={(value) => updateDataContact({email: value})}/>
                <label className="grid gap-2">
                    <span className="text-sm font-medium">Organization phone</span>
                    <PhoneNumberInput
                        value={draft.data.mainContact.phone}
                        defaultCountryIso2={draft.data.address.country || "CA"}
                        onValueChange={(value) => updateDataContact({phone: value})}
                    />
                </label>
            </div>
        </RegistrationStepLayout>
    )
}
