import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {FileField} from "./shared.tsx"

export function AvatarStepSection() {
    const {setFile} = useRegistration()

    return (
        <RegistrationStepLayout stepId="avatar">
            <FileField
                label="Owner avatar"
                description="Upload a profile image for the organization owner. This step is optional."
                onChange={(file) => setFile("avatar", file)}
            />
        </RegistrationStepLayout>
    )
}
