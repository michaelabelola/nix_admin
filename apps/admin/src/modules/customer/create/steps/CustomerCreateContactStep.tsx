import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {StepInput, StepSection} from "../customer-create.fields.tsx"

export function CustomerCreateContactStep() {
    const {draft, updateContact} = useCustomerCreate()

    return (
        <CustomerCreateStepLayout stepId="contact">
            <StepSection
                title="Contact channels"
                description="Add whichever communication endpoints should be stored immediately on the customer."
            >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <StepInput label="Primary email" type="email" value={draft.contact.email} onChange={(value) => updateContact({email: value})}/>
                    <StepInput label="Secondary email" type="email" value={draft.contact.secondaryEmail} onChange={(value) => updateContact({secondaryEmail: value})}/>
                    <StepInput label="Phone number" type="tel" value={draft.contact.phoneNumber} onChange={(value) => updateContact({phoneNumber: value})}/>
                    <StepInput label="Mobile number" type="tel" value={draft.contact.mobileNumber} onChange={(value) => updateContact({mobileNumber: value})}/>
                    <StepInput label="Fax number" value={draft.contact.faxNumber} onChange={(value) => updateContact({faxNumber: value})}/>
                    <StepInput label="Website" value={draft.contact.website} placeholder="https://example.com" onChange={(value) => updateContact({website: value})}/>
                </div>
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
