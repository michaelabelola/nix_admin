import {Separator} from "#/components/ui/separator.tsx";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {SummaryMetric} from "../../PropertyDetailsPrimitives.tsx";
import {formatDefinitionAmount, formatLocation, formatPricingDefinition} from "../../property-details.utils.ts";

export function PropertyDetailsSummaryTab({property}: { property?: PropertyModel.Detailed }) {
    const locationLabel = formatLocation(property?.location)

    return (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-lg border p-6">
                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold">Overview</h2>
                        <p className="text-sm text-muted-foreground">High-level property summary.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryMetric label="Type" value={property?.type}/>
                        <SummaryMetric label="Stage" value={property?.lifecycleStage}/>
                        <SummaryMetric label="Features" value={String(property?.features.length ?? 0)}/>
                        <SummaryMetric label="Tags" value={String(property?.tags.length ?? 0)}/>
                    </div>
                    <Separator/>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <SummaryMetric label="Default pricing" value={formatPricingDefinition(property?.defaultPriceDefinition)}/>
                        <SummaryMetric label="Default rent" value={formatDefinitionAmount(property?.defaultRentDefinition)}/>
                        <SummaryMetric label="Default lease" value={formatDefinitionAmount(property?.defaultLeaseDefinition)}/>
                        <SummaryMetric label="Location" value={locationLabel ?? "No location assigned"}/>
                    </div>
                </div>
            </section>

            <section className="rounded-lg border p-6">
                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold">Description</h2>
                        <p className="text-sm text-muted-foreground">Listing-ready copy from the property record.</p>
                    </div>
                    <div>
                        <div className="text-sm font-medium">Description</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {property?.description?.trim() || "No description added."}
                        </p>
                    </div>
                    <div>
                        <div className="text-sm font-medium">About</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {property?.about?.trim() || "No about content added."}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
