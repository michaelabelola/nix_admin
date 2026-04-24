import {Badge} from "#/components/ui/badge.tsx";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {EmptyState} from "../../PropertyDetailsPrimitives.tsx";
import {formatFeatureValue} from "../../property-details.utils.ts";

export function PropertyDetailsFeaturesTab({property}: { property?: PropertyModel.Detailed }) {
    return (
        <section className="rounded-lg border p-6">
            <div className="mb-4">
                <h2 className="font-semibold">Features</h2>
                <p className="text-sm text-muted-foreground">Registered property features and values.</p>
            </div>
            {property?.features.length ? (
                <div className="grid gap-3">
                    {property.features.map((feature) => (
                        <div key={feature.id} className="rounded-lg border p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-medium">{feature.name ?? "Unnamed feature"}</div>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description ?? "No description"}
                                    </p>
                                </div>
                                <Badge variant="outline">{feature.format ?? "UNSET"}</Badge>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">
                                {formatFeatureValue(feature) ?? "No value"}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No features yet"
                    description="This property does not have any feature records."
                />
            )}
        </section>
    )
}
