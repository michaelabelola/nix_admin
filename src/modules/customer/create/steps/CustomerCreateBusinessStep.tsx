import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {StepInput, StepSection} from "../customer-create.fields.tsx"

export function CustomerCreateBusinessStep() {
    const {draft, updateBusinessDetail} = useCustomerCreate()

    return (
        <CustomerCreateStepLayout stepId="business">
            <StepSection
                title="Business detail fields"
                description="Use these values when the customer represents a company, partner, government body, or internal organization."
            >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <StepInput label="Company name" value={draft.businessDetail.companyName} onChange={(value) => updateBusinessDetail({companyName: value})}/>
                    <StepInput label="Registration number" value={draft.businessDetail.registrationNumber} onChange={(value) => updateBusinessDetail({registrationNumber: value})}/>
                    <StepInput label="Tax ID" value={draft.businessDetail.taxID} onChange={(value) => updateBusinessDetail({taxID: value})}/>
                    <StepInput label="Industry" value={draft.businessDetail.industry} onChange={(value) => updateBusinessDetail({industry: value})}/>
                    <StepInput label="Company size" type="number" value={draft.businessDetail.companySize} onChange={(value) => updateBusinessDetail({companySize: value})}/>
                    <StepInput label="Business type" value={draft.businessDetail.businessType} onChange={(value) => updateBusinessDetail({businessType: value})}/>
                    <StepInput label="Legal form" value={draft.businessDetail.legalForm} onChange={(value) => updateBusinessDetail({legalForm: value})}/>
                    <StepInput label="Registration date" type="date" value={draft.businessDetail.registrationDate} onChange={(value) => updateBusinessDetail({registrationDate: value})}/>
                </div>
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
