import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {StepCountryField, StepDatePicker, StepInput, StepSection, StepSelect} from "../customer-create.fields.tsx"
const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say"]
export function CustomerCreatePersonalStep() {
    const {draft, updateDraft, updatePersonalDetail} = useCustomerCreate()

    return (
        <CustomerCreateStepLayout stepId="personal">
            <StepSection
                title="Personal detail fields"
                description="Use these fields when the customer is an individual, or when a mainContact identity should be stored on the record."
            >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <StepInput
                        label="Display name"
                        value={draft.displayName}
                        placeholder="Jane Smith"
                        description="Optional. This is the primary name shown across admin screens."
                        onChange={(value) => updateDraft({displayName: value})}
                    />
                    <StepInput label="First name" value={draft.personalDetail.firstName} onChange={(value) => updatePersonalDetail({firstName: value})}/>
                    <StepInput label="Middle name" value={draft.personalDetail.middleName} onChange={(value) => updatePersonalDetail({middleName: value})}/>
                    <StepInput label="Last name" value={draft.personalDetail.lastName} onChange={(value) => updatePersonalDetail({lastName: value})}/>
                    <StepInput label="Title" value={draft.personalDetail.title} onChange={(value) => updatePersonalDetail({title: value})}/>
                    <StepSelect label="Gender" value={draft.personalDetail.gender} placeholder="Select gender" options={GENDER_OPTIONS} onChange={(value) => updatePersonalDetail({gender: value})}/>
                    <StepDatePicker label="Date of birth" value={draft.personalDetail.dateOfBirth} onChange={(value) => updatePersonalDetail({dateOfBirth: value})} disabled={(date) => date > new Date()}/>

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
