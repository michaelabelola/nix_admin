import type {PropertyFeatureModel} from "@suiteonix/server"
import type {PropertyModel} from "@suiteonix/server"

export type ListingProfileCreateLocationState = Required<NonNullable<PropertyModel.CreateListingProfile["location"]>>

export type ListingProfileCreateFormState = {
    tagIds: PropertyModel.TagID[]
    featureIds: PropertyFeatureModel.PropertyFeatureID[]
    pricingId: string
    rentId: string
    leaseId: string
    galleryIds: PropertyModel.FileID[]
    avatarId: PropertyModel.FileID | null
    location: ListingProfileCreateLocationState
    isDefault: boolean
}

export type ListingProfileCreateLocationFieldKey = keyof ListingProfileCreateLocationState

export const EMPTY_OPTION = "__none__"

export const LOCATION_FIELDS: Array<{
    key: ListingProfileCreateLocationFieldKey
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

export function hasLocationFieldValue(
    location: PropertyModel.PropertyLocationDetailed | null | undefined,
    key: ListingProfileCreateLocationFieldKey,
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

export function buildInitialLocationState(property?: PropertyModel.Detailed): ListingProfileCreateLocationState {
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

export function buildInitialFormState(property?: PropertyModel.Detailed): ListingProfileCreateFormState {
    return {
        tagIds: property?.tags ?? [],
        featureIds: property?.features.map((feature) => feature.id) ?? [],
        pricingId: property?.defaultPriceDefinition?.id != null ? String(property.defaultPriceDefinition.id) : EMPTY_OPTION,
        rentId: property?.defaultRentDefinition?.id != null ? String(property.defaultRentDefinition.id) : EMPTY_OPTION,
        leaseId: property?.defaultLeaseDefinition?.id != null ? String(property.defaultLeaseDefinition.id) : EMPTY_OPTION,
        galleryIds: [],
        avatarId: null,
        location: buildInitialLocationState(property),
        isDefault: false,
    }
}
