import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@suiteonix/ui"
import {Checkbox} from "@suiteonix/ui"

import type {ListingProfileCreateLocationFieldKey} from "./property-listing-profile-create.shared.ts"

type LocationField = {
    key: ListingProfileCreateLocationFieldKey
    label: string
}

export function PropertyListingProfileLocationFieldsCard({
    availableLocationFields,
    hasLocation,
    selectedLocation,
    toggleLocationField,
}: {
    availableLocationFields: LocationField[]
    hasLocation: boolean
    selectedLocation: Record<ListingProfileCreateLocationFieldKey, boolean>
    toggleLocationField: (key: ListingProfileCreateLocationFieldKey, checked: boolean) => void
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Location Fields</CardTitle>
                <CardDescription>
                    Choose which populated property location fields should be copied into the listing profile snapshot.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {availableLocationFields.map((field) => (
                    <label key={field.key} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                        <Checkbox
                            checked={selectedLocation[field.key]}
                            onCheckedChange={(checked) => toggleLocationField(field.key, checked === true)}
                        />
                        <span>{field.label}</span>
                    </label>
                ))}

                {!hasLocation ? (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        This property does not have a location assigned yet.
                    </div>
                ) : availableLocationFields.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        This property location does not have any populated fields to copy.
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}

