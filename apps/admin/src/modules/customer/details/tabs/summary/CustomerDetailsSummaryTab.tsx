import type {CustomerModel} from "@suiteonix/server"
import {
    formatCustomerAddress,
    getCustomerDisplayName,
} from "#/modules/customer/details/customer-details.utils.ts"

import {SummaryMetric} from "../../CustomerDetailsPrimitives.tsx"
import {Card, CardContent, CardHeader} from "#/components/ui/card.tsx";

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
            <Card className="rounded-lg p-4 sm:p-5">
                <CardHeader className="mb-4">
                    <h2 className="font-semibold">Overview</h2>
                    <p className="text-sm text-muted-foreground">High-level customer summary.</p>
                </CardHeader>

                <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {overviewItems.map((item) => (
                        <SummaryMetric key={item.label} label={item.label} value={item.value}/>
                    ))}
                    <SummaryMetric label="Tags" value={String(customer?.tags?.length ?? 0)}/>
                    <SummaryMetric label="Segments" value={String(customer?.segments?.length ?? 0)}/>
                </CardContent>
            </Card>

            {profileItems.length ? (
                <Card className="rounded-lg p-4 sm:p-5">
                    <CardHeader className="mb-4">
                        <h2 className="font-semibold">Profile</h2>
                        <p className="text-sm text-muted-foreground">Resolved identity and location details.</p>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            {profileItems.map((item) => (
                                <div key={item.label}>
                                    <dt className="text-sm text-muted-foreground">{item.label}</dt>
                                    <dd className="mt-1 break-words text-sm font-medium">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}
