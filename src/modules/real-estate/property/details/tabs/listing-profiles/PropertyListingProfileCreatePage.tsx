import {useEffect, useMemo, useState} from "react"
import {useNavigate} from "@tanstack/react-router"
import {ArrowLeft, PlusCircle} from "lucide-react"
import {toast} from "sonner"

import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {Checkbox} from "#/components/ui/checkbox.tsx"
import {Label} from "#/components/ui/label.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx"
import type {TagModel} from "#/modules/tags/model.ts"
import {TagRequest} from "#/modules/tags/request.hook.ts"
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts"
import {LeaseDefinitionApiHook} from "#/modules/real-estate/lease-definition/api.hook.ts"
import type {PropertyFeatureModel} from "#/modules/real-estate/property-feature/model.ts"
import type {PropertyModel} from "#/modules/real-estate/property/model.ts"
import {PricingApiHook} from "#/modules/real-estate/pricing/api.hook.ts"
import {RentDefinitionRequest} from "#/modules/real-estate/rent-definition/api.hook.ts"

type FormState = {
    tagIds: PropertyModel.TagID[]
    featureIds: PropertyFeatureModel.PropertyFeatureID[]
    pricingId: string
    rentId: string
    leaseId: string
    location: Required<NonNullable<PropertyModel.CreateListingProfile["location"]>>
    isDefault: boolean
}

const EMPTY_OPTION = "__none__"

function hasLocationFieldValue(
    location: PropertyModel.PropertyLocationDetailed | null | undefined,
    key: keyof Required<NonNullable<PropertyModel.CreateListingProfile["location"]>>,
) {
    if (!location) return false

    switch (key) {
        case "apartment":
            return location.apartment != null
        case "unit":
            return location.unit != null
        case "building":
            return location.building != null
        case "floor":
            return location.floor != null
        case "line1":
            return location.line1 != null
        case "line2":
            return location.line2 != null
        case "city":
            return location.city != null
        case "state":
            return location.state != null
        case "postalCode":
            return location.postalCode != null
        case "country":
            return location.country != null
        case "latLng":
            return location.latitude != null || location.longitude != null
        default:
            return false
    }
}

function buildInitialLocationState(property?: PropertyModel.Detailed): Required<NonNullable<PropertyModel.CreateListingProfile["location"]>> {
    return {
        apartment: hasLocationFieldValue(property?.location, "apartment"),
        unit: hasLocationFieldValue(property?.location, "unit"),
        building: hasLocationFieldValue(property?.location, "building"),
        floor: hasLocationFieldValue(property?.location, "floor"),
        line1: hasLocationFieldValue(property?.location, "line1"),
        line2: hasLocationFieldValue(property?.location, "line2"),
        city: hasLocationFieldValue(property?.location, "city"),
        state: hasLocationFieldValue(property?.location, "state"),
        postalCode: hasLocationFieldValue(property?.location, "postalCode"),
        country: hasLocationFieldValue(property?.location, "country"),
        latLng: hasLocationFieldValue(property?.location, "latLng"),
    }
}

function buildInitialFormState(property?: PropertyModel.Detailed): FormState {
    return {
        tagIds: property?.tags ?? [],
        featureIds: property?.features.map((feature) => feature.id) ?? [],
        pricingId: property?.defaultPriceDefinition?.id != null ? String(property.defaultPriceDefinition.id) : EMPTY_OPTION,
        rentId: property?.defaultRentDefinition?.id != null ? String(property.defaultRentDefinition.id) : EMPTY_OPTION,
        leaseId: property?.defaultLeaseDefinition?.id != null ? String(property.defaultLeaseDefinition.id) : EMPTY_OPTION,
        location: buildInitialLocationState(property),
        isDefault: false,
    }
}

export function PropertyListingProfileCreatePage({
    property,
    propertyId,
}: {
    property?: PropertyModel.Detailed
    propertyId: PropertyModel.PropertyID
}) {
    const navigate = useNavigate()
    const [formState, setFormState] = useState<FormState>(() => buildInitialFormState(property))

    const tagDetailsQuery = TagRequest.useGetTagsBatch(property?.tags ?? [])
    const pricingQuery = PricingApiHook.useQueryPropertyPricings({
        propertyId,
        page: 0,
        size: 100,
    })
    const rentQuery = RentDefinitionRequest.useQueryPropertyRents({
        propertyId,
        page: 0,
        size: 100,
    })
    const leaseQuery = LeaseDefinitionApiHook.useQueryPropertyLeases({
        propertyId,
        page: 0,
        size: 100,
    })
    const createListingProfile = PropertyApiHook.useCreatePropertyListingProfile(() => {
        toast.success("Listing profile created.")
        void navigate({
            to: "/admin/real-estate/properties/$propertyId/listing-profiles",
            params: {propertyId},
        })
    })

    useEffect(() => {
        setFormState(buildInitialFormState(property))
    }, [property?.id])

    const assignedTags = useMemo(() => {
        const lookup = new Map((tagDetailsQuery.data ?? []).map((tag) => [tag.id, tag] as const))
        return (property?.tags ?? []).map((tagId) => lookup.get(tagId)).filter(Boolean) as TagModel.Tag[]
    }, [property?.tags, tagDetailsQuery.data])

    const unresolvedTagIds = useMemo(
        () => (property?.tags ?? []).filter((tagId) => !assignedTags.some((tag) => tag.id === tagId)),
        [assignedTags, property?.tags],
    )

    const availableFeatures = property?.features ?? []
    const hasLocation = Boolean(property?.location)
    const availableLocationFields = useMemo(
        () => LOCATION_FIELDS.filter((field) => hasLocationFieldValue(property?.location, field.key)),
        [property?.location],
    )
    const isSubmitting = createListingProfile.isPending

    function toggleSelection<T extends string>(values: T[], value: T, checked: boolean) {
        if (checked) {
            return values.includes(value) ? values : [...values, value]
        }
        return values.filter((item) => item !== value)
    }

    function toggleTag(tagId: PropertyModel.TagID, checked: boolean) {
        setFormState((prev) => ({
            ...prev,
            tagIds: toggleSelection(prev.tagIds, tagId, checked),
        }))
    }

    function toggleFeature(featureId: PropertyFeatureModel.PropertyFeatureID, checked: boolean) {
        setFormState((prev) => ({
            ...prev,
            featureIds: toggleSelection(prev.featureIds, featureId, checked),
        }))
    }

    function toggleLocationField(key: keyof FormState["location"], checked: boolean) {
        setFormState((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [key]: checked,
            },
        }))
    }

    function handleCreate() {
        void createListingProfile.mutateAsync({
            propertyId,
            body: {
                tagIds: formState.tagIds,
                featureIds: formState.featureIds,
                pricingId: formState.pricingId !== EMPTY_OPTION ? formState.pricingId : undefined,
                rentId: formState.rentId !== EMPTY_OPTION ? formState.rentId : undefined,
                leaseId: formState.leaseId !== EMPTY_OPTION ? formState.leaseId : undefined,
                location: availableLocationFields.length > 0 ? formState.location : undefined,
                isDefault: formState.isDefault,
            },
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="gap-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1">
                            <CardTitle>Create Listing Profile</CardTitle>
                            <CardDescription>
                                Build a listing-profile snapshot from the current property record. The profile name, description,
                                and about fields are copied from the property automatically.
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    void navigate({
                                        to: "/admin/real-estate/properties/$propertyId/listing-profiles",
                                        params: {propertyId},
                                    })
                                }}
                            >
                                <ArrowLeft className="size-4"/>
                                Back
                            </Button>
                            <Button onClick={handleCreate} disabled={!property?.id || isSubmitting}>
                                <PlusCircle className="size-4"/>
                                {isSubmitting ? "Creating..." : "Create Listing Profile"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Snapshot Sources</CardTitle>
                    <CardDescription>Choose which default pricing and tenancy definitions to include in the profile.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="grid gap-2">
                        <Label htmlFor="listing-profile-pricing">Pricing definition</Label>
                        <Select value={formState.pricingId} onValueChange={(value) => setFormState((prev) => ({...prev, pricingId: value}))}>
                            <SelectTrigger id="listing-profile-pricing" className="w-full">
                                <SelectValue placeholder="Select pricing"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EMPTY_OPTION}>No pricing</SelectItem>
                                {(pricingQuery.data?.content ?? []).map((pricing) => (
                                    <SelectItem key={String(pricing.id)} value={String(pricing.id)}>
                                        {String(pricing.id)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="listing-profile-rent">Rent definition</Label>
                        <Select value={formState.rentId} onValueChange={(value) => setFormState((prev) => ({...prev, rentId: value}))}>
                            <SelectTrigger id="listing-profile-rent" className="w-full">
                                <SelectValue placeholder="Select rent"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EMPTY_OPTION}>No rent</SelectItem>
                                {(rentQuery.data?.content ?? []).map((rent) => (
                                    <SelectItem key={String(rent.id)} value={String(rent.id)}>
                                        {rent.name || String(rent.id)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="listing-profile-lease">Lease definition</Label>
                        <Select value={formState.leaseId} onValueChange={(value) => setFormState((prev) => ({...prev, leaseId: value}))}>
                            <SelectTrigger id="listing-profile-lease" className="w-full">
                                <SelectValue placeholder="Select lease"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EMPTY_OPTION}>No lease</SelectItem>
                                {(leaseQuery.data?.content ?? []).map((lease) => (
                                    <SelectItem key={String(lease.id)} value={String(lease.id)}>
                                        {lease.name || String(lease.id)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <label className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm">
                        <Checkbox
                            checked={formState.isDefault}
                            onCheckedChange={(checked) => setFormState((prev) => ({...prev, isDefault: checked === true}))}
                        />
                        <span>Mark as default profile</span>
                    </label>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tags</CardTitle>
                    <CardDescription>Select which current property tags should be copied into the listing profile.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {assignedTags.map((tag) => (
                        <label key={tag.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                            <Checkbox
                                checked={formState.tagIds.includes(tag.id)}
                                onCheckedChange={(checked) => toggleTag(tag.id, checked === true)}
                            />
                            <span className="min-w-0">
                                <span className="block font-medium">{tag.name || tag.id}</span>
                                <span className="block text-muted-foreground">{tag.id}</span>
                            </span>
                        </label>
                    ))}

                    {unresolvedTagIds.map((tagId) => (
                        <label key={tagId} className="flex items-start gap-3 rounded-lg border border-dashed p-3 text-sm">
                            <Checkbox
                                checked={formState.tagIds.includes(tagId)}
                                onCheckedChange={(checked) => toggleTag(tagId, checked === true)}
                            />
                            <span className="min-w-0">
                                <span className="block font-medium">{tagId}</span>
                                <span className="block text-muted-foreground">Tag details unavailable</span>
                            </span>
                        </label>
                    ))}

                    {property && property.tags.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                            This property has no assigned tags.
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>Select which current property features should be copied into the listing profile.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                    {availableFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                            <Checkbox
                                checked={formState.featureIds.includes(feature.id)}
                                onCheckedChange={(checked) => toggleFeature(feature.id, checked === true)}
                            />
                            <span className="min-w-0">
                                <span className="block font-medium">{feature.name || feature.id}</span>
                                <span className="block text-muted-foreground">{feature.description || "No description"}</span>
                            </span>
                        </label>
                    ))}

                    {property && property.features.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                            This property has no assigned features.
                        </div>
                    ) : null}
                </CardContent>
            </Card>

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
                                checked={formState.location[field.key]}
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
        </div>
    )
}

const LOCATION_FIELDS: Array<{
    key: keyof Required<NonNullable<PropertyModel.CreateListingProfile["location"]>>
    label: string
}> = [
    {key: "apartment", label: "Apartment"},
    {key: "unit", label: "Unit"},
    {key: "building", label: "Building"},
    {key: "floor", label: "Floor"},
    {key: "line1", label: "Address line 1"},
    {key: "line2", label: "Address line 2"},
    {key: "city", label: "City"},
    {key: "state", label: "State"},
    {key: "postalCode", label: "Postal code"},
    {key: "country", label: "Country"},
    {key: "latLng", label: "Latitude / longitude"},
]
