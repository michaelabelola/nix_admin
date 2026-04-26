import {Separator} from "#/components/ui/separator.tsx"
import type {CustomerModel} from "#/modules/customer/model.ts"
import {
    formatCustomerAddress,
    getCustomerDisplayName,
} from "#/modules/customer/details/customer-details.utils.ts"

import {SummaryMetric} from "../../CustomerDetailsPrimitives.tsx"

function buildPrimaryContact(customer?: CustomerModel.Detailed) {
    if (customer?.contact?.email) return customer.contact.email
    if (customer?.contact?.phoneNumber) return customer.contact.phoneNumber
    if (customer?.contact?.mobileNumber) return customer.contact.mobileNumber
    return null
}

export function CustomerDetailsSummaryTab({customer}: { customer?: CustomerModel.Detailed }) {
    const billingAddress = formatCustomerAddress(customer?.billingAddress)
    const shippingAddress = formatCustomerAddress(customer?.shippingAddress)

    return (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-lg border p-6">
                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold">Overview</h2>
                        <p className="text-sm text-muted-foreground">High-level customer summary.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryMetric label="Type" value={customer?.type || null}/>
                        <SummaryMetric label="Stage" value={customer?.lifecycleStage || null}/>
                        <SummaryMetric label="Tags" value={String(customer?.tags?.length ?? 0)}/>
                        <SummaryMetric label="Segments" value={String(customer?.segments?.length ?? 0)}/>
                    </div>
                    <Separator/>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <SummaryMetric label="Status" value={customer?.status || null}/>
                        <SummaryMetric label="Primary contact" value={buildPrimaryContact(customer)}/>
                        <SummaryMetric label="Language" value={customer?.language || null}/>
                        <SummaryMetric label="Timezone" value={customer?.timezone || null}/>
                        <SummaryMetric label="Storage" value={customer?.storageID != null ? String(customer.storageID) : null}/>
                        <SummaryMetric label="External ID" value={customer?.externalId || null}/>
                    </div>
                </div>
            </section>

            <section className="rounded-lg border p-6">
                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold">Profile</h2>
                        <p className="text-sm text-muted-foreground">Resolved identity and location details.</p>
                    </div>
                    <div>
                        <div className="text-sm font-medium">Display Name</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {getCustomerDisplayName(customer)}
                        </p>
                    </div>
                    <div>
                        <div className="text-sm font-medium">Billing Address</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {billingAddress || "No billing address added."}
                        </p>
                    </div>
                    <div>
                        <div className="text-sm font-medium">Shipping Address</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {shippingAddress || "No shipping address added."}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
