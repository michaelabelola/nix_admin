import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

export function ContactStepSection() {
    const {draft, updateDataContact} = useRegistration()
    const isDisabled = !draft.data.contact.email.trim() || !draft.data.contact.phone.trim()

    return (
        <RegistrationStepLayout stepId="contact" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Organization email" type="email" value={draft.data.contact.email} onChange={(value) => updateDataContact({email: value})}/>
                <TextField label="Organization phone" type="tel" value={draft.data.contact.phone} onChange={(value) => updateDataContact({phone: value})}/>
            </div>
        </RegistrationStepLayout>
    )
}
