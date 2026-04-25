import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {Checkbox} from "#/components/ui/checkbox.tsx"
import {PropertyFeatureQuickViewPopover} from "#/modules/real-estate/property-feature/components/PropertyFeatureQuickViewPopover.tsx"
import type {PropertyFeatureModel} from "#/modules/real-estate/property-feature/model.ts"
import {EyeIcon} from "lucide-react";

export function PropertyListingProfileFeaturesCard({
    features,
    selectedFeatureIds,
    toggleFeature,
}: {
    features: PropertyFeatureModel.PropertyFeature[]
    selectedFeatureIds: PropertyFeatureModel.PropertyFeatureID[]
    toggleFeature: (featureId: PropertyFeatureModel.PropertyFeatureID, checked: boolean) => void
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Select which current property features should be copied into the listing profile.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
                {features.map((feature) => (
                    <div key={feature.id} className="rounded-lg border p-3 text-sm">
                        <div className="flex items-start justify-between gap-3">
                            <label className="flex min-w-0 flex-1 items-start gap-3">
                                <Checkbox
                                    checked={selectedFeatureIds.includes(feature.id)}
                                    onCheckedChange={(checked) => toggleFeature(feature.id, checked === true)}
                                />
                                <span className="min-w-0">
                                    <span className="block font-medium">{feature.name || feature.id}</span>
                                    <span className="block text-muted-foreground">{feature.description || "No description"}</span>
                                </span>
                            </label>

                            <PropertyFeatureQuickViewPopover feature={feature}>
                                <Button variant="outline" size="xs">
                                    <EyeIcon/>
                                </Button>
                            </PropertyFeatureQuickViewPopover>
                        </div>
                    </div>
                ))}

                {features.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        This property has no assigned features.
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}

