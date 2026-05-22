import {MessageSquareText} from "lucide-react"

import {StepInput, StepSection} from "@suiteonix/admin/src/modules/customer/create/customer-create.fields.tsx"

import {useCustomerRegister} from "../customer-register.context.tsx"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"

export function CustomerRegisterContactStep() {
    const {draft, updateContact} = useCustomerRegister()

    return (
        <CustomerRegisterStepLayout>
            <RegisterStepInsight icon={MessageSquareText} title="Add alternate ways to reach you">
                Your login email is already captured. These fields help support and service teams contact you through other channels when needed.
            </RegisterStepInsight>

            <StepSection
                title="Additional contact channels"
                description="The account email is captured in the first step; these fields are optional."
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <StepInput
                        label="Secondary email"
                        type="email"
                        value={draft.contact.secondaryEmail}
                        onChange={(value) => updateContact({secondaryEmail: value})}
                    />
                    <StepInput
                        label="Phone number"
                        type="tel"
                        value={draft.contact.phoneNumber}
                        onChange={(value) => updateContact({phoneNumber: value})}
                    />
                    <StepInput
                        label="Mobile number"
                        type="tel"
                        value={draft.contact.mobileNumber}
                        onChange={(value) => updateContact({mobileNumber: value})}
                    />
                    <StepInput
                        label="Website"
                        value={draft.contact.website}
                        placeholder="https://example.com"
                        onChange={(value) => updateContact({website: value})}
                    />
                </div>
            </StepSection>
        </CustomerRegisterStepLayout>
    )
}
