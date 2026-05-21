import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"
import {
    parseIds,
    StepSection,
    StepSwitch,
    StepTextarea,
    stringifyIds,
} from "../customer-create.fields.tsx"

export function CustomerCreatePreferencesStep() {
    const {draft, updatePreferences, setSegmentIds} = useCustomerCreate()

    return (
        <CustomerCreateStepLayout stepId="preferences">
            <StepSection
                title="Communication preferences"
                description="These values will be stored in the initial create payload."
            >
                <div className="grid gap-3">
                    <StepSwitch
                        label="Marketing consent"
                        description="Allow the customer to be included in marketing outreach."
                        checked={draft.preferences.marketingConsent}
                        onCheckedChange={(checked) => updatePreferences({marketingConsent: checked})}
                    />
                    <StepSwitch
                        label="Email notifications"
                        description="Enable email-based notifications for this customer."
                        checked={draft.preferences.emailNotifications}
                        onCheckedChange={(checked) => updatePreferences({emailNotifications: checked})}
                    />
                    <StepSwitch
                        label="SMS notifications"
                        description="Enable SMS-based notifications for this customer."
                        checked={draft.preferences.smsNotifications}
                        onCheckedChange={(checked) => updatePreferences({smsNotifications: checked})}
                    />
                </div>
            </StepSection>

            <StepSection
                title="Segments"
                description="Enter existing customer segment ids that should be attached during creation."
            >
                <StepTextarea
                    label="Segment IDs"
                    value={stringifyIds(draft.segmentIds)}
                    rows={6}
                    description="Separate ids with commas, spaces, or line breaks."
                    placeholder="segment-a&#10;segment-b"
                    onChange={(value) => setSegmentIds(parseIds(value))}
                />
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
