import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {DefinitionCard, EmptyState, SummaryMetric} from "./PropertyDetailsPrimitives.tsx";
import {formatDuration, formatMoney} from "./property-details.utils.ts";

export function PropertyDetailsLeaseTab({property}: { property?: PropertyModel.Detailed }) {
    const definition = property?.defaultLeaseDefinition

    return (
        <DefinitionCard
            title="Lease"
            description="Default lease definition assigned to this property."
        >
            {definition ? (
                <div className="grid gap-4 md:grid-cols-2">
                    <SummaryMetric label="Name" value={definition.name ?? "Untitled"}/>
                    <SummaryMetric label="Amount" value={formatMoney(definition.amount)}/>
                    <SummaryMetric label="Duration" value={formatDuration(definition.duration, definition.durationUnit)}/>
                    <SummaryMetric label="Definition ID" value={String(definition.id)}/>
                    <div className="md:col-span-2 rounded-lg border p-4">
                        <div className="text-sm font-medium">Description</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {definition.description?.trim() || "No description added."}
                        </p>
                    </div>
                </div>
            ) : (
                <EmptyState
                    title="No lease definition"
                    description="Set a default lease definition to populate this tab."
                />
            )}
        </DefinitionCard>
    )
}
