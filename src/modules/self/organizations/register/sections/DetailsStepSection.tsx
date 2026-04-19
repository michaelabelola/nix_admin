import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

export function DetailsStepSection() {
    const {draft, updateDataDetail} = useRegistration()
    const isDisabled = !draft.data.detail.registrationCountry.trim()

    return (
        <RegistrationStepLayout stepId="details" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label="Registration number"
                    value={draft.data.detail.registrationNumber ?? ""}
                    onChange={(value) => updateDataDetail({registrationNumber: value})}
                />
                <TextField
                    label="Registration country"
                    value={draft.data.detail.registrationCountry}
                    onChange={(value) => updateDataDetail({registrationCountry: value})}
                />
                <TextField
                    label="Date established"
                    type="date"
                    value={draft.data.detail.dateEstablished ?? ""}
                    onChange={(value) => updateDataDetail({dateEstablished: value})}
                />
            </div>
        </RegistrationStepLayout>
    )
}
