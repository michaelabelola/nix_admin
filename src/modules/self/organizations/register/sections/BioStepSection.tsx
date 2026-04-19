import {Textarea} from "#/components/ui/textarea.tsx"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"

export function BioStepSection() {
    const {draft, updateData, updateDataDetail} = useRegistration()

    return (
        <RegistrationStepLayout stepId="bio">
            <div className="grid gap-4">
                <label className="grid gap-2">
                    <span className="text-sm font-medium">Short bio</span>
                    <Textarea
                        value={draft.data.bio ?? ""}
                        onChange={(event) => updateData({bio: event.target.value})}
                        placeholder="A concise overview of what your organization does."
                        rows={4}
                    />
                </label>
                <label className="grid gap-2">
                    <span className="text-sm font-medium">About the organization</span>
                    <Textarea
                        value={draft.data.detail.about ?? ""}
                        onChange={(event) => updateDataDetail({about: event.target.value})}
                        placeholder="A longer narrative about your services, mission, or experience."
                        rows={7}
                    />
                </label>
            </div>
        </RegistrationStepLayout>
    )
}
