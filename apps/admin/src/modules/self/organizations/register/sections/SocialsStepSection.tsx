import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {REGISTRATION_SOCIAL_ACCOUNTS, useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

export function SocialsStepSection() {
    const {draft, updateDataSocials} = useRegistration()
    const socials = draft.data.socials

    return (
        <RegistrationStepLayout stepId="socials">
            <div className="grid gap-4 md:grid-cols-2">
                {REGISTRATION_SOCIAL_ACCOUNTS.map((account) => (
                    <TextField
                        key={account.name}
                        label={account.label}
                        value={socials?.find((social) => social.name === account.name)?.value ?? ""}
                        onChange={(value) => updateDataSocials(account.name, value)}
                    />
                ))}
            </div>
        </RegistrationStepLayout>
    )
}
