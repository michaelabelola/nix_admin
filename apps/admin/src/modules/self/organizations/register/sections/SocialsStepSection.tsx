import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {TextField} from "./shared.tsx"

export function SocialsStepSection() {
    const {draft, updateDataSocials} = useRegistration()
    const socials = draft.data.socials

    return (
        <RegistrationStepLayout stepId="socials">
            <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Website" value={socials.website} onChange={(value) => updateDataSocials({website: value})}/>
                <TextField label="Facebook" value={socials.facebook} onChange={(value) => updateDataSocials({facebook: value})}/>
                <TextField label="Twitter / X" value={socials.twitter} onChange={(value) => updateDataSocials({twitter: value})}/>
                <TextField label="Instagram" value={socials.instagram} onChange={(value) => updateDataSocials({instagram: value})}/>
                <TextField label="LinkedIn" value={socials.linkedin} onChange={(value) => updateDataSocials({linkedin: value})}/>
                <TextField label="YouTube" value={socials.youtube} onChange={(value) => updateDataSocials({youtube: value})}/>
                <TextField label="Snapchat" value={socials.snapchat} onChange={(value) => updateDataSocials({snapchat: value})}/>
                <TextField label="Pinterest" value={socials.pinterest} onChange={(value) => updateDataSocials({pinterest: value})}/>
            </div>
        </RegistrationStepLayout>
    )
}
