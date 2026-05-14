import type {CustomerModel} from "#/modules/customer/model.ts"
import {
    formatCustomerAddress,
    getCustomerDisplayName,
} from "#/modules/customer/details/customer-details.utils.ts"

import {SummaryMetric} from "../../CustomerDetailsPrimitives.tsx"

type SummaryItem = {
    label: string
    value?: string | null
}

function buildPrimaryContact(customer?: CustomerModel.Detailed) {
    if (customer?.contact?.email) return customer.contact.email
    if (customer?.contact?.phoneNumber) return customer.contact.phoneNumber
    if (customer?.contact?.mobileNumber) return customer.contact.mobileNumber
    return null
}

function visibleItems(items: SummaryItem[]) {
    return items.filter((item) => item.value?.trim())
}

export function CustomerDetailsSummaryTab({customer}: { customer?: CustomerModel.Detailed }) {
    const billingAddress = formatCustomerAddress(customer?.billingAddress)
    const shippingAddress = formatCustomerAddress(customer?.shippingAddress)
    const overviewItems = visibleItems([
        {label: "Type", value: customer?.type || null},
        {label: "Stage", value: customer?.lifecycleStage || null},
        {label: "Status", value: customer?.status || null},
        {label: "Primary contact", value: buildPrimaryContact(customer)},
        {label: "Language", value: customer?.language || null},
        {label: "Timezone", value: customer?.timezone || null},
        {label: "Storage", value: customer?.storageID != null ? String(customer.storageID) : null},
        {label: "External ID", value: customer?.externalId || null},
    ])
    const profileItems = visibleItems([
        {label: "Display Name", value: getCustomerDisplayName(customer)},
        {label: "Billing Address", value: billingAddress},
        {label: "Shipping Address", value: shippingAddress},
    ])

    return (
        <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
            <section className="rounded-lg bg-muted/20 p-4 sm:p-5">
                <div className="mb-4">
                    <h2 className="font-semibold">Overview</h2>
                    <p className="text-sm text-muted-foreground">High-level customer summary.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {overviewItems.map((item) => (
                        <SummaryMetric key={item.label} label={item.label} value={item.value}/>
                    ))}
                    <SummaryMetric label="Tags" value={String(customer?.tags?.length ?? 0)}/>
                    <SummaryMetric label="Segments" value={String(customer?.segments?.length ?? 0)}/>
                </div>
            </section>

            {profileItems.length ? (
                <section className="rounded-lg bg-muted/20 p-4 sm:p-5">
                    <div className="mb-4">
                        <h2 className="font-semibold">Profile</h2>
                        <p className="text-sm text-muted-foreground">Resolved identity and location details.</p>
                    </div>
                    <dl className="space-y-4">
                        {profileItems.map((item) => (
                            <div key={item.label}>
                                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                                <dd className="mt-1 break-words text-sm font-medium">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ) : null}
        </div>
    )
}
