import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {FileField} from "./shared.tsx"

export function AvatarStepSection() {
    const {draft, setFile} = useRegistration()

    return (
        <RegistrationStepLayout stepId="avatar">
            <FileField
                label="Owner avatar"
                description="Upload a profile image for the organization owner. This step is optional."
                value={draft.avatar}
                previewClassName="aspect-square max-w-72"
                onChange={(file) => setFile("avatar", file)}
            />
        </RegistrationStepLayout>
    )
}
