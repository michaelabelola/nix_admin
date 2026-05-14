import type {ReactNode} from "react"

import {Spinner} from "#/components/ui/spinner.tsx"
import {CustomerRequest} from "#/modules/customer/request.hook.ts"
import type {CustomerModel} from "#/modules/customer/model.ts"
import organizationRequest from "#/modules/organization/organization.request.ts"
import {
    formatAuditDate,
    formatCustomerAddress,
} from "#/modules/customer/details/customer-details.utils.ts"

import {KeyValue} from "../../CustomerDetailsPrimitives.tsx"

function DetailGroup({
    title,
    description,
    children,
}: {
    title: string
    description?: string
    children: ReactNode
}) {
    return (
        <section className="rounded-lg bg-muted/20 p-4">
            <div className="mb-3">
                <h3 className="font-medium">{title}</h3>
                {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
            </div>
            <dl className="grid gap-1">
                {children}
            </dl>
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
                <DetailGroup title="Record" description="Identifiers and lifecycle metadata.">
                    <KeyValue label="Customer ID" value={customer?.id}/>
                    <KeyValue label="Customer Number" value={customer?.customerNumber}/>
                    <KeyValue label="Display Name" value={customer?.displayName}/>
                    <KeyValue label="External ID" value={customer?.externalId}/>
                    <KeyValue label="Type" value={customer?.type}/>
                    <KeyValue label="Lifecycle Stage" value={customer?.lifecycleStage}/>
                    <KeyValue label="Status" value={customer?.status}/>
                    <KeyValue label="Storage ID" value={customer?.storageID != null ? String(customer.storageID) : null}/>
                </DetailGroup>

                <DetailGroup title="Organization" description="Owning organization and regional preferences.">
                    <KeyValue
                        label="Organization"
                        value={
                            isLoadingOrg
                                ? <Spinner className="size-4"/>
                                : org?.shortName || org?.name || customer?.entityID
                        }
                    />
                    <KeyValue label="Language" value={customer?.language}/>
                    <KeyValue label="Timezone" value={customer?.timezone}/>
                    <KeyValue label="Tags" value={tags.length ? String(tags.length) : null}/>
                    <KeyValue label="Segments" value={customer?.segments?.length != null ? String(customer.segments.length) : null}/>
                </DetailGroup>

                <DetailGroup title="Personal" description="Identity details captured for individual profiles.">
                    <KeyValue label="Title" value={personal?.title}/>
                    <KeyValue label="First Name" value={personal?.firstName}/>
                    <KeyValue label="Middle Name" value={personal?.middleName}/>
                    <KeyValue label="Last Name" value={personal?.lastName}/>
                    <KeyValue label="Gender" value={personal?.gender}/>
                    <KeyValue label="Date of Birth" value={personal?.dateOfBirth}/>
                    <KeyValue label="Nationality" value={personal?.nationality}/>
                    <KeyValue label="Country of Birth" value={personal?.countryOfBirth}/>
                    <KeyValue label="Profession" value={personal?.profession}/>
                    <KeyValue label="Marital Status" value={personal?.maritalStatus}/>
                    <KeyValue label="Passport Number" value={personal?.passportNumber}/>
                    <KeyValue label="National ID" value={personal?.nationalID}/>
                    <KeyValue label="Mother's Maiden Name" value={personal?.mothersMaidenName}/>
                </DetailGroup>

                <DetailGroup title="Business" description="Company details used when the customer represents an organization.">
                    <KeyValue label="Company Name" value={business?.companyName}/>
                    <KeyValue label="Registration Number" value={business?.registrationNumber}/>
                    <KeyValue label="Tax ID" value={business?.taxID}/>
                    <KeyValue label="Industry" value={business?.industry}/>
                    <KeyValue label="Company Size" value={business?.companySize != null ? String(business.companySize) : null}/>
                    <KeyValue label="Business Type" value={business?.businessType}/>
                    <KeyValue label="Legal Form" value={business?.legalForm}/>
                    <KeyValue label="Registration Date" value={business?.registrationDate}/>
                </DetailGroup>

                <DetailGroup title="Contact" description="Primary communication channels.">
                    <KeyValue label="Primary Email" value={customer?.contact?.email}/>
                    <KeyValue label="Secondary Email" value={customer?.contact?.secondaryEmail}/>
                    <KeyValue label="Phone Number" value={customer?.contact?.phoneNumber}/>
                    <KeyValue label="Mobile Number" value={customer?.contact?.mobileNumber}/>
                    <KeyValue label="Fax Number" value={customer?.contact?.faxNumber}/>
                    <KeyValue label="Website" value={customer?.contact?.website}/>
                </DetailGroup>

                <DetailGroup title="Addresses" description="Billing and shipping destinations.">
                    <KeyValue label="Billing Address" value={formatCustomerAddress(customer?.billingAddress)}/>
                    <KeyValue label="Shipping Address" value={formatCustomerAddress(customer?.shippingAddress)}/>
                </DetailGroup>

                <DetailGroup title="Audit" description="Record creation and update timestamps.">
                    <KeyValue label="Created" value={formatAuditDate(customer?.audit?.createdDate)}/>
                    <KeyValue label="Modified" value={formatAuditDate(customer?.audit?.modifiedDate)}/>
                </DetailGroup>
            </div>
        </div>
    )
}
