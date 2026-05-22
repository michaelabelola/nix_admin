import {Bell} from "lucide-react"

import {StepSection, StepSwitch} from "../customer-create.fields.tsx"

import {useCustomerRegister} from "../customer-register.context.tsx"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"

export function CustomerRegisterPreferencesStep() {
    const {draft, updatePreferences} = useCustomerRegister()

    return (
        <CustomerRegisterStepLayout>
            <RegisterStepInsight icon={Bell} title="Choose the default communication posture">
                These preferences are sent with the customer account request and can be updated later from the portal.
            </RegisterStepInsight>

            <StepSection
                title="Communication preferences"
                description="Set the initial consent and notification preferences for this customer."
            >
                <div className="grid gap-3">
                    <StepSwitch
                        label="Marketing consent"
                        checked={draft.preferences.marketingConsent}
                        onCheckedChange={(marketingConsent) => updatePreferences({marketingConsent})}
                    />
                    <StepSwitch
                        label="Email notifications"
                        checked={draft.preferences.emailNotifications}
                        onCheckedChange={(emailNotifications) => updatePreferences({emailNotifications})}
                    />
                    <StepSwitch
                        label="SMS notifications"
                        checked={draft.preferences.smsNotifications}
                        onCheckedChange={(smsNotifications) => updatePreferences({smsNotifications})}
                    />
                </div>
            </StepSection>
        </CustomerRegisterStepLayout>
    )
}
