import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

export function OrgNameStepSection() {
    const {draft, updateData} = useRegistration()
    const isDisabled = !draft.data.name.trim() || !draft.data.shortName.trim()

    return (
        <RegistrationStepLayout stepId="org-name" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label="Organization name"
                    value={draft.data.name}
                    onChange={(value) => updateData({name: value})}
                    placeholder="Suiteonix Realty"
                />
                <TextField
                    label="Short name"
                    value={draft.data.shortName}
                    onChange={(value) => updateData({shortName: value})}
                    placeholder="Suiteonix"
                />
            </div>
        </RegistrationStepLayout>
    )
}
