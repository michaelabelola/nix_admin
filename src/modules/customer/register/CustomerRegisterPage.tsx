import {CustomerRegisterProvider, useCustomerRegister} from "./customer-register.context.tsx"
import {CustomerRegisterAddressesStep} from "./steps/CustomerRegisterAddressesStep.tsx"
import {CustomerRegisterAccountStep} from "./steps/CustomerRegisterAccountStep.tsx"
import {CustomerRegisterContactStep} from "./steps/CustomerRegisterContactStep.tsx"
import {CustomerRegisterPreferencesStep} from "./steps/CustomerRegisterPreferencesStep.tsx"
import {CustomerRegisterProfileStep} from "./steps/CustomerRegisterProfileStep.tsx"
import {CustomerRegisterReviewStep} from "./steps/CustomerRegisterReviewStep.tsx"

export function CustomerRegisterPage() {
    return (
        <CustomerRegisterProvider>
            <main className="page-wrap min-h-screen px-4 py-8">
                <div className="mb-8 grid gap-2">
                    <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                        Customer Registration
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight">Create your customer account</h1>
                    <p className="max-w-3xl text-muted-foreground">
                        Register a customer self account with credentials, profile details, contact channels, and preferences.
                    </p>
                </div>
                <CustomerRegisterCurrentStep/>
            </main>
        </CustomerRegisterProvider>
    )
}

function CustomerRegisterCurrentStep() {
    const {stepId} = useCustomerRegister()

    switch (stepId) {
        case "profile":
            return <CustomerRegisterProfileStep/>
        case "contact":
            return <CustomerRegisterContactStep/>
        case "addresses":
            return <CustomerRegisterAddressesStep/>
        case "preferences":
            return <CustomerRegisterPreferencesStep/>
        case "review":
            return <CustomerRegisterReviewStep/>
        case "account":
        default:
            return <CustomerRegisterAccountStep/>
    }
}
