import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {StepCountryField, StepInput, StepSection} from "../customer-create.fields.tsx"

export function CustomerCreatePersonalStep() {
    const {draft, updatePersonalDetail} = useCustomerCreate()

    return (
        <CustomerCreateStepLayout stepId="personal">
            <StepSection
                title="Personal detail fields"
                description="Use these fields when the customer is an individual, or when a contact identity should be stored on the record."
            >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <StepInput label="First name" value={draft.personalDetail.firstName} onChange={(value) => updatePersonalDetail({firstName: value})}/>
                    <StepInput label="Middle name" value={draft.personalDetail.middleName} onChange={(value) => updatePersonalDetail({middleName: value})}/>
                    <StepInput label="Last name" value={draft.personalDetail.lastName} onChange={(value) => updatePersonalDetail({lastName: value})}/>
                    <StepInput label="Title" value={draft.personalDetail.title} onChange={(value) => updatePersonalDetail({title: value})}/>
                    <StepInput label="Gender" value={draft.personalDetail.gender} onChange={(value) => updatePersonalDetail({gender: value})}/>
                    <StepInput label="Date of birth" type="date" value={draft.personalDetail.dateOfBirth} onChange={(value) => updatePersonalDetail({dateOfBirth: value})}/>
                    <StepInput label="Nationality" value={draft.personalDetail.nationality} onChange={(value) => updatePersonalDetail({nationality: value})}/>
                    <StepInput label="Passport number" value={draft.personalDetail.passportNumber} onChange={(value) => updatePersonalDetail({passportNumber: value})}/>
                    <StepInput label="National ID" value={draft.personalDetail.nationalID} onChange={(value) => updatePersonalDetail({nationalID: value})}/>
                    <StepInput label="Marital status" value={draft.personalDetail.maritalStatus} onChange={(value) => updatePersonalDetail({maritalStatus: value})}/>
                    <StepInput label="Mother's maiden name" value={draft.personalDetail.mothersMaidenName} onChange={(value) => updatePersonalDetail({mothersMaidenName: value})}/>
                    <StepCountryField label="Country of birth" value={draft.personalDetail.countryOfBirth} onChange={(value) => updatePersonalDetail({countryOfBirth: value})}/>
                    <StepInput label="Profession" value={draft.personalDetail.profession} onChange={(value) => updatePersonalDetail({profession: value})}/>
                </div>
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
