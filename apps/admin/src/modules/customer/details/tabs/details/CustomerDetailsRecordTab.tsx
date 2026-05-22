import type {ReactNode} from "react"

import {Spinner} from "@suiteonix/ui"
import {CustomerRequest} from "@suiteonix/server"
import type {CustomerModel} from "@suiteonix/server"
import {OrganizationRequest as organizationRequest} from "@suiteonix/server"
import {
    formatAuditDate,
    formatCustomerAddress,
} from "#/modules/customer/details/customer-details.utils.ts"

import {KeyValue} from "../../CustomerDetailsPrimitives.tsx"
import {Card, CardContent, CardHeader} from "@suiteonix/ui";

type DetailItem = {
    label: string
    value?: string | ReactNode | null
}

function hasDetailValue(value: DetailItem["value"]) {
    if (value == null) {
        return false
    }

    return typeof value !== "string" || value.trim().length > 0
}

function DetailGroup({
                         title,
                         description,
                         items,
                     }: {
    title: string
    description?: string
    items: DetailItem[]
}) {
    const visibleItems = items.filter((item) => hasDetailValue(item.value))

    if (!visibleItems.length) {
        return null
    }

    return (
        <section>
            <Card className={"p-4"} variant={"glass"}>
                <CardHeader>
                    <div className="mb-3">
                        <h3 className="font-medium">{title}</h3>
                        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-1">
                        {visibleItems.map((item) => (
                            <KeyValue key={item.label} label={item.label} value={item.value}/>
                        ))}
                    </dl>
                </CardContent>
            </Card>
        </section>
    )
}

export function CustomerDetailsRecordTab({customer}: { customer?: CustomerModel.Detailed }) {
    const {data: tags = []} = CustomerRequest.useGetCustomerTags(customer?.id)
    const {data: org, isLoading: isLoadingOrg} = organizationRequest.useGetOrganizationByID(customer?.entityID)
    const personal = customer?.personalDetail
    const business = customer?.businessDetail

    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold">Customer details</h2>
                <p className="text-sm text-muted-foreground">Core fields saved on the customer record.</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <DetailGroup
                    title="Record"
                    description="Identifiers and lifecycle metadata."
                    items={[
                        {label: "Customer ID", value: customer?.id},
                        {label: "Customer Number", value: customer?.customerNumber},
                        {label: "Display Name", value: customer?.displayName},
                        {label: "External ID", value: customer?.externalId},
                        {label: "Type", value: customer?.type},
                        {label: "Lifecycle Stage", value: customer?.lifecycleStage},
                        {label: "Status", value: customer?.status},
                        {label: "Storage ID", value: customer?.storageID != null ? String(customer.storageID) : null},
                    ]}
                />

                <DetailGroup
                    title="Organization"
                    description="Owning organization and regional preferences."
                    items={[
                        {
                            label: "Organization",
                            value:
                                isLoadingOrg
                                    ? <Spinner className="size-4"/>
                                    : org?.shortName || org?.name || customer?.entityID,
                        },
                        {label: "Language", value: customer?.language},
                        {label: "Timezone", value: customer?.timezone},
                        {label: "Tags", value: tags.length ? String(tags.length) : null},
                        {
                            label: "Segments",
                            value: customer?.segments?.length ? String(customer.segments.length) : null
                        },
                    ]}
                />

                <DetailGroup
                    title="Personal"
                    description="Identity details captured for individual profiles."
                    items={[
                        {label: "Title", value: personal?.title},
                        {label: "First Name", value: personal?.firstName},
                        {label: "Middle Name", value: personal?.middleName},
                        {label: "Last Name", value: personal?.lastName},
                        {label: "Gender", value: personal?.gender},
                        {label: "Date of Birth", value: personal?.dateOfBirth},
                        {label: "Nationality", value: personal?.nationality},
                        {label: "Country of Birth", value: personal?.countryOfBirth},
                        {label: "Profession", value: personal?.profession},
                        {label: "Marital Status", value: personal?.maritalStatus},
                        {label: "Passport Number", value: personal?.passportNumber},
                        {label: "National ID", value: personal?.nationalID},
                        {label: "Mother's Maiden Name", value: personal?.mothersMaidenName},
                    ]}
                />

                <DetailGroup
                    title="Business"
                    description="Company details used when the customer represents an organization."
                    items={[
                        {label: "Company Name", value: business?.companyName},
                        {label: "Registration Number", value: business?.registrationNumber},
                        {label: "Tax ID", value: business?.taxID},
                        {label: "Industry", value: business?.industry},
                        {
                            label: "Company Size",
                            value: business?.companySize != null ? String(business.companySize) : null
                        },
                        {label: "Business Type", value: business?.businessType},
                        {label: "Legal Form", value: business?.legalForm},
                        {label: "Registration Date", value: business?.registrationDate},
                    ]}
                />

                <DetailGroup
                    title="Contact"
                    description="Primary communication channels."
                    items={[
                        {label: "Primary Email", value: customer?.contact?.email},
                        {label: "Secondary Email", value: customer?.contact?.secondaryEmail},
                        {label: "Phone Number", value: customer?.contact?.phoneNumber},
                        {label: "Mobile Number", value: customer?.contact?.mobileNumber},
                        {label: "Fax Number", value: customer?.contact?.faxNumber},
                        {label: "Website", value: customer?.contact?.website},
                    ]}
                />

                <DetailGroup
                    title="Addresses"
                    description="Billing and shipping destinations."
                    items={[
                        {label: "Billing Address", value: formatCustomerAddress(customer?.billingAddress)},
                        {label: "Shipping Address", value: formatCustomerAddress(customer?.shippingAddress)},
                    ]}
                />

                <DetailGroup
                    title="Audit"
                    description="Record creation and update timestamps."
                    items={[
                        {label: "Created", value: formatAuditDate(customer?.audit?.createdDate)},
                        {label: "Modified", value: formatAuditDate(customer?.audit?.modifiedDate)},
                    ]}
                />
            </div>
        </div>
    )
}
