import {Truck} from "lucide-react"

import {StepSection, StepSwitch} from "../customer-create.fields.tsx"
import {useCustomerRegister} from "../customer-register.context.tsx"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"
import {CustomerRegisterAddressFields} from "./CustomerRegisterAddressesStep.tsx"

export function CustomerRegisterShippingAddressStep() {
    const {
        draft,
        updateDraft,
        updateShippingAddress,
    } = useCustomerRegister()

    return (
        <CustomerRegisterStepLayout>
            <RegisterStepInsight icon={Truck} title="Set the shipping destination">
                Use the billing address for shipping, or provide a separate destination.
            </RegisterStepInsight>

            <StepSection title="Shipping address" description="Optional shipping address stored on the customer profile.">
                <StepSwitch
                    label="Shipping address is the same as billing"
                    checked={draft.sameAsBillingAddress}
                    onCheckedChange={(sameAsBillingAddress) => updateDraft({sameAsBillingAddress})}
                />

                {!draft.sameAsBillingAddress ? (
                    <CustomerRegisterAddressFields address={draft.shippingAddress} onChange={updateShippingAddress}/>
                ) : null}
            </StepSection>
        </CustomerRegisterStepLayout>
    )
}
