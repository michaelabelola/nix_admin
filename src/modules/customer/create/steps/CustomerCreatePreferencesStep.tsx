import {Badge} from "#/components/ui/badge.tsx"
import {ObjectVisibility} from "#/models/PagedModel.ts"
import {TagRequest} from "#/modules/tags/request.hook.ts"

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
    const {draft, updatePreferences, setTags, setSegmentIds} = useCustomerCreate()
    const availableTagsQuery = TagRequest.useQueryTags({
        page: 0,
        size: 24,
        show: ObjectVisibility.ENTITY_AND_SYSTEM,
    })

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
                title="Classification"
                description="Enter existing ids for any tags or customer segments that should be attached during creation."
            >
                <div className="grid gap-4 lg:grid-cols-2">
                    <StepTextarea
                        label="Tag IDs"
                        value={stringifyIds(draft.tags)}
                        rows={6}
                        description="Separate ids with commas, spaces, or line breaks."
                        placeholder="12345&#10;67890"
                        onChange={(value) => setTags(parseIds(value))}
                    />

                    <StepTextarea
                        label="Segment IDs"
                        value={stringifyIds(draft.segmentIds)}
                        rows={6}
                        description="Separate ids with commas, spaces, or line breaks."
                        placeholder="segment-a&#10;segment-b"
                        onChange={(value) => setSegmentIds(parseIds(value))}
                    />
                </div>

                <div className="grid gap-3 rounded-lg border bg-muted/20 p-4">
                    <div className="font-medium">Available tags</div>
                    <p className="text-sm text-muted-foreground">
                        Use these ids if you want to assign existing tags during customer creation.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {availableTagsQuery.data.content.length ? availableTagsQuery.data.content.map((tag) => (
                            <Badge key={tag.id} variant="outline">
                                {(tag.name?.trim() || tag.id)}: {tag.id}
                            </Badge>
                        )) : (
                            <span className="text-sm text-muted-foreground">
                                {availableTagsQuery.isFetching ? "Loading tags..." : "No tags available."}
                            </span>
                        )}
                    </div>
                </div>
            </StepSection>
        </CustomerCreateStepLayout>
    )
}
