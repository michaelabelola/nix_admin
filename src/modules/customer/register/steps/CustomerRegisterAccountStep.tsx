import {KeyRound} from "lucide-react"

import {Alert, AlertDescription} from "#/components/ui/alert.tsx"
import {StepInput, StepSection} from "#/modules/customer/create/customer-create.fields.tsx"

import {useCustomerRegister} from "../customer-register.context.tsx"
import {isPasswordConfirmed} from "../customer-register.utils.ts"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"

export function CustomerRegisterAccountStep() {
    const {draft, updateDraft, getFieldError} = useCustomerRegister()
    const passwordMismatch = Boolean(draft.confirmPassword && !isPasswordConfirmed(draft))
    const serverEmailError = getFieldError("email")
    const serverPasswordError = getFieldError("password")

    return (
        <CustomerRegisterStepLayout>
            <RegisterStepInsight icon={KeyRound} title="Start with the account identity">
                The email and password create the customer login profile. Display name can be added on the profile step or left blank.
            </RegisterStepInsight>

            <StepSection
                title="Account credentials"
                description="These values create the login profile for the customer account."
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <StepInput
                        label="Email"
                        type="email"
                        value={draft.email}
                        placeholder="jane@example.com"
                        onChange={(value) => updateDraft({email: value})}
                    />
                    <StepInput
                        label="Password"
                        type="password"
                        value={draft.password}
                        onChange={(value) => updateDraft({password: value})}
                    />
                    <StepInput
                        label="Confirm password"
                        type="password"
                        value={draft.confirmPassword}
                        onChange={(value) => updateDraft({confirmPassword: value})}
                    />
                    <StepInput
                        label="Language"
                        value={draft.language}
                        placeholder="en"
                        onChange={(value) => updateDraft({language: value})}
                    />
                </div>

                {passwordMismatch ? (
                    <Alert variant="destructive">
                        <AlertDescription>Passwords must match before continuing.</AlertDescription>
                    </Alert>
                ) : null}

                {serverEmailError || serverPasswordError ? (
                    <Alert variant="destructive">
                        <AlertDescription>{serverEmailError || serverPasswordError}</AlertDescription>
                    </Alert>
                ) : null}
            </StepSection>
        </CustomerRegisterStepLayout>
    )
}
