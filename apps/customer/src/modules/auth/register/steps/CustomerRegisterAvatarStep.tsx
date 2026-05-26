import {ImageUp, Trash2} from "lucide-react"

import {Button} from "@suiteonix/ui"

import {StepFileInput, StepSection} from "../customer-create.fields.tsx"
import {useCustomerRegister} from "../customer-register.context.tsx"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"

export function CustomerRegisterAvatarStep() {
    const {draft, updateDraft} = useCustomerRegister()

    return (
        <CustomerRegisterStepLayout>
            <RegisterStepInsight icon={ImageUp} title="Choose a profile image">
                Add an optional image for the customer profile. The account can be created without one.
            </RegisterStepInsight>

            <StepSection title="Avatar" description="Upload an image that should be attached to the new customer account.">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <StepFileInput
                        label="Avatar image"
                        accept="image/*"
                        fileName={draft.avatar?.name}
                        onChange={(avatar) => updateDraft({avatar})}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!draft.avatar}
                        onClick={() => updateDraft({avatar: null})}
                    >
                        <Trash2 className="size-4"/>
                        Remove
                    </Button>
                </div>
            </StepSection>
        </CustomerRegisterStepLayout>
    )
}
