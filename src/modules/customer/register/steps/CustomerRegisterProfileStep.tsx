import {UserRound} from "lucide-react"

import {StepDatePicker, StepInput, StepSection, StepSelect} from "#/modules/customer/create/customer-create.fields.tsx"

import {useCustomerRegister} from "../customer-register.context.tsx"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"

const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say"]

export function CustomerRegisterProfileStep() {
    const {draft, updatePersonalDetail} = useCustomerRegister()
    const personal = draft.personalDetail

    return (
        <CustomerRegisterStepLayout>
            <RegisterStepInsight icon={UserRound} title="Build the profile at your pace">
                Profile fields are optional during registration. Add what is available now and complete the rest after account verification.
            </RegisterStepInsight>

            <StepSection
                title="Personal details"
                description="Add identity details that should be stored on the customer profile."
            >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <StepInput label="First name" value={personal.firstName} onChange={(value) => updatePersonalDetail({firstName: value})}/>
                    <StepInput label="Middle name" value={personal.middleName} onChange={(value) => updatePersonalDetail({middleName: value})}/>
                    <StepInput label="Last name" value={personal.lastName} onChange={(value) => updatePersonalDetail({lastName: value})}/>
                    <StepInput label="Title" value={personal.title} placeholder="Ms." onChange={(value) => updatePersonalDetail({title: value})}/>
                    <StepSelect label="Gender" value={personal.gender} placeholder="Select gender" options={GENDER_OPTIONS} onChange={(value) => updatePersonalDetail({gender: value})}/>
                    <StepDatePicker label="Date of birth" value={personal.dateOfBirth} onChange={(value) => updatePersonalDetail({dateOfBirth: value})} disabled={(date) => date > new Date()}/>
                    <StepInput label="Nationality" value={personal.nationality} onChange={(value) => updatePersonalDetail({nationality: value})}/>
                    <StepInput label="Passport number" value={personal.passportNumber} onChange={(value) => updatePersonalDetail({passportNumber: value})}/>
                    <StepInput label="National ID" value={personal.nationalID} onChange={(value) => updatePersonalDetail({nationalID: value})}/>
                    <StepInput label="Marital status" value={personal.maritalStatus} onChange={(value) => updatePersonalDetail({maritalStatus: value})}/>
                    <StepInput label="Mother's maiden name" value={personal.mothersMaidenName} onChange={(value) => updatePersonalDetail({mothersMaidenName: value})}/>
                    <StepInput label="Country of birth" value={personal.countryOfBirth} onChange={(value) => updatePersonalDetail({countryOfBirth: value})}/>
                    <StepInput label="Profession" value={personal.profession} onChange={(value) => updatePersonalDetail({profession: value})}/>
                </div>
            </StepSection>
        </CustomerRegisterStepLayout>
    )
}
