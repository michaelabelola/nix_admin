import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {EmptyState, SummaryMetric} from "../../PropertyDetailsPrimitives.tsx";
import {formatMoney} from "../../property-details.utils.ts";

export function PropertyDetailsPricingTab({property}: { property?: PropertyModel.Detailed }) {
    const pricing = property?.defaultPriceDefinition

    return (
        <section className="rounded-lg border p-6">
            <div className="mb-4">
                <h2 className="font-semibold">Pricing</h2>
                <p className="text-sm text-muted-foreground">Default pricing attached to this property.</p>
            </div>
            {pricing ? (
                <div className="grid gap-4 sm:grid-cols-3">
                    <SummaryMetric label="Amount" value={formatMoney(pricing.amount)}/>
                    <SummaryMetric label="Pricing ID" value={String(pricing.id)}/>
                    <SummaryMetric label="Entity ID" value={pricing.entityID}/>
                </div>
            ) : (
                <EmptyState
                    title="No default pricing"
                    description="Assign a pricing definition to populate this tab."
                />
            )}
        </section>
    )
}
