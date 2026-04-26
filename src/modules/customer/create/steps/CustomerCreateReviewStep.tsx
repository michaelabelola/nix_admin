import {Badge} from "#/components/ui/badge.tsx"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card.tsx"

import {useCustomerCreate} from "../customer-create.context.tsx"
import {CustomerCreateStepLayout} from "../CustomerCreateStepLayout.tsx"

function ReviewRows({
    rows,
}: {
    rows: Array<{ label: string; value?: string | number | boolean | null }>
}) {
    const visibleRows = rows.filter((row) => row.value !== undefined && row.value !== null && row.value !== "")

    if (!visibleRows.length) {
        return <p className="text-sm text-muted-foreground">No values provided.</p>
    }

    return (
        <div className="grid gap-3">
            {visibleRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-4">
                    <div className="text-sm font-medium">{row.label}</div>
                    <div className="text-sm text-muted-foreground sm:text-right">
                        {typeof row.value === "boolean" ? (row.value ? "Yes" : "No") : String(row.value)}
                    </div>
                </div>
            ))}
        </div>
    )
}

export function CustomerCreateReviewStep() {
    const {draft, canSubmit, isSubmitting, submitDraft} = useCustomerCreate()

    return (
        <CustomerCreateStepLayout
            stepId="review"
            nextLabel="Create customer"
            disableNext={!canSubmit}
            isBusy={isSubmitting}
            onNext={submitDraft}
        >
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{draft.type}</Badge>
                <Badge variant="outline">{draft.lifecycleStage}</Badge>
                {draft.language.trim() ? <Badge variant="outline">Language: {draft.language.trim()}</Badge> : null}
                {draft.timezone.trim() ? <Badge variant="outline">Timezone: {draft.timezone.trim()}</Badge> : null}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Basics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "Display name", value: draft.displayName.trim()},
                            {label: "External ID", value: draft.externalId.trim()},
                            {label: "Customer type", value: draft.type},
                            {label: "Lifecycle stage", value: draft.lifecycleStage},
                            {label: "Language", value: draft.language.trim()},
                            {label: "Timezone", value: draft.timezone.trim()},
                        ]}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "First name", value: draft.personalDetail.firstName.trim()},
                            {label: "Middle name", value: draft.personalDetail.middleName.trim()},
                            {label: "Last name", value: draft.personalDetail.lastName.trim()},
                            {label: "Title", value: draft.personalDetail.title.trim()},
                            {label: "Gender", value: draft.personalDetail.gender.trim()},
                            {label: "Date of birth", value: draft.personalDetail.dateOfBirth.trim()},
                            {label: "Nationality", value: draft.personalDetail.nationality.trim()},
                            {label: "Passport number", value: draft.personalDetail.passportNumber.trim()},
                            {label: "National ID", value: draft.personalDetail.nationalID.trim()},
                            {label: "Marital status", value: draft.personalDetail.maritalStatus.trim()},
                            {label: "Mother's maiden name", value: draft.personalDetail.mothersMaidenName.trim()},
                            {label: "Country of birth", value: draft.personalDetail.countryOfBirth.trim()},
                            {label: "Profession", value: draft.personalDetail.profession.trim()},
                        ]}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Business Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "Company name", value: draft.businessDetail.companyName.trim()},
                            {label: "Registration number", value: draft.businessDetail.registrationNumber.trim()},
                            {label: "Tax ID", value: draft.businessDetail.taxID.trim()},
                            {label: "Industry", value: draft.businessDetail.industry.trim()},
                            {label: "Company size", value: draft.businessDetail.companySize.trim()},
                            {label: "Business type", value: draft.businessDetail.businessType.trim()},
                            {label: "Legal form", value: draft.businessDetail.legalForm.trim()},
                            {label: "Registration date", value: draft.businessDetail.registrationDate.trim()},
                        ]}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "Primary email", value: draft.contact.email.trim()},
                            {label: "Secondary email", value: draft.contact.secondaryEmail.trim()},
                            {label: "Phone number", value: draft.contact.phoneNumber.trim()},
                            {label: "Mobile number", value: draft.contact.mobileNumber.trim()},
                            {label: "Fax number", value: draft.contact.faxNumber.trim()},
                            {label: "Website", value: draft.contact.website.trim()},
                        ]}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "Label", value: draft.billingAddress.label.trim()},
                            {label: "Line 1", value: draft.billingAddress.line1.trim()},
                            {label: "Line 2", value: draft.billingAddress.line2.trim()},
                            {label: "City", value: draft.billingAddress.city.trim()},
                            {label: "State", value: draft.billingAddress.state.trim()},
                            {label: "Province", value: draft.billingAddress.province.trim()},
                            {label: "Postal code", value: draft.billingAddress.postalCode.trim()},
                            {label: "Country", value: draft.billingAddress.country.trim()},
                            {label: "Latitude", value: draft.billingAddress.latitude.trim()},
                            {label: "Longitude", value: draft.billingAddress.longitude.trim()},
                        ]}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "Label", value: draft.shippingAddress.label.trim()},
                            {label: "Line 1", value: draft.shippingAddress.line1.trim()},
                            {label: "Line 2", value: draft.shippingAddress.line2.trim()},
                            {label: "City", value: draft.shippingAddress.city.trim()},
                            {label: "State", value: draft.shippingAddress.state.trim()},
                            {label: "Province", value: draft.shippingAddress.province.trim()},
                            {label: "Postal code", value: draft.shippingAddress.postalCode.trim()},
                            {label: "Country", value: draft.shippingAddress.country.trim()},
                            {label: "Latitude", value: draft.shippingAddress.latitude.trim()},
                            {label: "Longitude", value: draft.shippingAddress.longitude.trim()},
                        ]}/>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Preferences & Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ReviewRows rows={[
                        {label: "Marketing consent", value: draft.preferences.marketingConsent},
                        {label: "Email notifications", value: draft.preferences.emailNotifications},
                        {label: "SMS notifications", value: draft.preferences.smsNotifications},
                    ]}/>

                    <div className="grid gap-3 border-t pt-4 md:grid-cols-2">
                        <div>
                            <div className="text-sm font-medium">Tag IDs</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {draft.tags.length ? draft.tags.map((tagId) => (
                                    <Badge key={tagId} variant="outline">{tagId}</Badge>
                                )) : (
                                    <span className="text-sm text-muted-foreground">No tags selected.</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium">Segment IDs</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {draft.segmentIds.length ? draft.segmentIds.map((segmentId) => (
                                    <Badge key={segmentId} variant="outline">{segmentId}</Badge>
                                )) : (
                                    <span className="text-sm text-muted-foreground">No segments selected.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CustomerCreateStepLayout>
    )
}
