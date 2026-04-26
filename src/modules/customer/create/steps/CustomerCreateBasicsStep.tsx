import {CustomerModel} from "#/modules/customer/model.ts"

import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {StepInput, StepSection, StepSelect} from "../customer-create.fields.tsx"

export function CustomerCreateBasicsStep() {
    const {draft, updateDraft} = useCustomerCreate()
    const disableNext = !draft.displayName.trim() || !draft.type || !draft.lifecycleStage

    return (
        <CustomerCreateStepLayout stepId="basics" disableNext={disableNext}>
            <StepSection
                title="Core customer record"
                description="These fields define how the customer appears and is classified when the record is created."
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <StepInput
                        label="Display name"
                        value={draft.displayName}
                        placeholder="Acme Holdings"
                        description="Required. This is the primary name shown across admin screens."
                        onChange={(value) => updateDraft({displayName: value})}
                    />

                    <StepInput
                        label="External ID"
                        value={draft.externalId}
                        placeholder="External CRM identifier"
                        description="Optional reference id from an external system."
                        onChange={(value) => updateDraft({externalId: value})}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StepSelect
                        label="Customer type"
                        value={draft.type}
                        description="Required. Choose the category that best matches the customer."
                        onChange={(value) => updateDraft({type: value as CustomerModel.CustomerType})}
                        options={Object.values(CustomerModel.CustomerType)}
                    />

                    <StepSelect
                        label="Lifecycle stage"
                        value={draft.lifecycleStage}
                        description="Required. Sets the initial stage after creation."
                        onChange={(value) => updateDraft({lifecycleStage: value as CustomerModel.CustomerLifecycleStage})}
                        options={Object.values(CustomerModel.CustomerLifecycleStage)}
                    />

                    <StepInput
                        label="Language"
                        value={draft.language}
                        placeholder="en"
                        description="Optional preferred language code."
                        onChange={(value) => updateDraft({language: value})}
                    />

                    <StepInput
                        label="Timezone"
                        value={draft.timezone}
                        placeholder="America/Toronto"
                        description="Optional IANA timezone."
                        onChange={(value) => updateDraft({timezone: value})}
                    />
                </div>
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
