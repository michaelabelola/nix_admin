import {ClipboardCheck} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card.tsx"

import {useCustomerRegister} from "../customer-register.context.tsx"
import {RegisterStepInsight} from "../CustomerRegisterStepPrimitives.tsx"
import {CustomerRegisterStepLayout} from "../CustomerRegisterStepLayout.tsx"

type ReviewRow = {
    label: string
    value?: string | boolean | null
}

function ReviewRows({rows}: { rows: ReviewRow[] }) {
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
                        {typeof row.value === "boolean" ? (row.value ? "Yes" : "No") : row.value}
                    </div>
                </div>
            ))}
        </div>
    )
}

export function CustomerRegisterReviewStep() {
    const {draft} = useCustomerRegister()

    return (
        <CustomerRegisterStepLayout>
            <RegisterStepInsight icon={ClipboardCheck} title="Final check before submission">
                Confirm the information below. The backend will create the customer account and authentication profile when you submit.
            </RegisterStepInsight>

            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Customer self account</Badge>
                <Badge variant="outline">{draft.email.trim()}</Badge>
                {draft.language.trim() ? <Badge variant="outline">Language: {draft.language.trim()}</Badge> : null}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "Display name", value: draft.displayName.trim()},
                            {label: "Email", value: draft.email.trim()},
                            {label: "Language", value: draft.language.trim()},
                        ]}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Profile</CardTitle>
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
                        <CardTitle className="text-base">Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "Secondary email", value: draft.contact.secondaryEmail.trim()},
                            {label: "Phone number", value: draft.contact.phoneNumber.trim()},
                            {label: "Mobile number", value: draft.contact.mobileNumber.trim()},
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

                {!draft.sameAsBillingAddress ? (
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
                ) : null}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewRows rows={[
                            {label: "Marketing consent", value: draft.preferences.marketingConsent},
                            {label: "Email notifications", value: draft.preferences.emailNotifications},
                            {label: "SMS notifications", value: draft.preferences.smsNotifications},
                            {label: "Shipping same as billing", value: draft.sameAsBillingAddress},
                        ]}/>
                    </CardContent>
                </Card>
            </div>
        </CustomerRegisterStepLayout>
    )
}
