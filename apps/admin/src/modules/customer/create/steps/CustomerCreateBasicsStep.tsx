import {CustomerModel} from "@suiteonix/server"

import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {StepInput, StepSection, StepSelect} from "../customer-create.fields.tsx"

export function CustomerCreateBasicsStep() {
    const {draft, updateDraft} = useCustomerCreate()
    const disableNext = !draft.type || !draft.lifecycleStage

    return (
        <CustomerCreateStepLayout stepId="basics" disableNext={disableNext}>
            <StepSection
                title="Core customer record"
                description="These fields define how the customer appears and is classified when the record is created."
            >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                        label="External ID"
                        value={draft.externalId}
                        placeholder="External CRM identifier"
                        description="Optional reference id from an external system."
                        onChange={(value) => updateDraft({externalId: value})}
                    />
                </div>
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
