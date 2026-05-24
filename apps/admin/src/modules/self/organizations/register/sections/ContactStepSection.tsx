import {PhoneNumberInput} from "#/modules/location/components/PhoneNumberInput.tsx"
import {OrganizationModel} from "@suiteonix/server"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {getRegistrationContactValue, useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

export function ContactStepSection() {
    const {draft, updateDataContact} = useRegistration()
    const whatsapp = getRegistrationContactValue(draft.data.contacts, OrganizationModel.ContactMethod.WHATSAPP)
    const isDisabled = !draft.data.email.trim() || !draft.data.phone.trim()

    return (
        <RegistrationStepLayout stepId="contact" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Organization email" type="email" value={draft.data.email} onChange={(value) => updateDataContact({email: value})}/>
                <label className="grid gap-2">
                    <span className="text-sm font-medium">Organization phone</span>
                    <PhoneNumberInput
                        value={draft.data.phone}
                        defaultCountryIso2={draft.data.address.country || "CA"}
                        onValueChange={(value) => updateDataContact({phone: value})}
                    />
                </label>
                <label className="grid gap-2">
                    <span className="text-sm font-medium">WhatsApp</span>
                    <PhoneNumberInput
                        value={whatsapp}
                        defaultCountryIso2={draft.data.address.country || "CA"}
                        onValueChange={(value) => updateDataContact({whatsapp: value})}
                    />
                </label>
            </div>
        </RegistrationStepLayout>
    )
}
