import {NixModule} from "@suiteonix/server/models"
import {TagPicker} from "#/modules/tags/components/TagPicker.tsx"

import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {StepSection} from "../customer-create.fields.tsx"

export function CustomerCreateTagsStep() {
    const {draft, setTags} = useCustomerCreate()

    return (
        <CustomerCreateStepLayout stepId="tags">
            <StepSection
                title="Customer tags"
                description="Search by name or id, narrow results by module and type, then select the tags that should classify this customer."
            >
                <TagPicker
                    value={draft.tags}
                    onChange={setTags}
                    defaultModule={NixModule.CUSTOMER}
                    placeholder="Search customer tags"
                />
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
