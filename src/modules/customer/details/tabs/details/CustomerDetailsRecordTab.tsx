import {Spinner} from "#/components/ui/spinner.tsx"
import {CustomerRequest} from "#/modules/customer/request.hook.ts"
import type {CustomerModel} from "#/modules/customer/model.ts"
import organizationRequest from "#/modules/organization/organization.request.ts"
import {
    formatAuditDate,
    formatCustomerAddress,
} from "#/modules/customer/details/customer-details.utils.ts"

import {KeyValue} from "../../CustomerDetailsPrimitives.tsx"

export function CustomerDetailsRecordTab({customer}: { customer?: CustomerModel.Detailed }) {
    const {data: tags} = CustomerRequest.useGetCustomerTags(customer?.id)
    const {data: org, isLoading: isLoadingOrg} = organizationRequest.useGetOrganizationByID(customer?.entityID)

    return (
        <section className="rounded-lg border p-6">
            <div className="mb-4">
                <h2 className="font-semibold">Customer details</h2>
                <p className="text-sm text-muted-foreground">Core fields saved on the customer record.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                <KeyValue label="Customer ID" value={customer?.id}/>
                <KeyValue label="Customer Number" value={customer?.customerNumber}/>
                <KeyValue label="Display Name" value={customer?.displayName}/>
                <KeyValue label="External ID" value={customer?.externalId}/>
                <KeyValue label="Type" value={customer?.type}/>
                <KeyValue label="Lifecycle Stage" value={customer?.lifecycleStage}/>
                <KeyValue label="Status" value={customer?.status}/>
                <KeyValue label="Storage ID" value={customer?.storageID != null ? String(customer.storageID) : null}/>
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
                <KeyValue label="Primary Email" value={customer?.contact?.email}/>
                <KeyValue label="Phone Number" value={customer?.contact?.phoneNumber || customer?.contact?.mobileNumber}/>
                <KeyValue label="Website" value={customer?.contact?.website}/>
                <KeyValue label="Billing Address" value={formatCustomerAddress(customer?.billingAddress)}/>
                <KeyValue label="Shipping Address" value={formatCustomerAddress(customer?.shippingAddress)}/>
                <KeyValue label="Tags" value={tags.length ? String(tags.length) : null}/>
                <KeyValue label="Segments" value={customer?.segments?.length != null ? String(customer.segments.length) : null}/>
                <KeyValue label="Created" value={formatAuditDate(customer?.audit?.createdDate)}/>
                <KeyValue label="Modified" value={formatAuditDate(customer?.audit?.modifiedDate)}/>
            </div>
        </section>
    )
}
