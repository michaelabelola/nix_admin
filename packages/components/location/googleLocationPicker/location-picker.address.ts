import type {
    GoogleAddressComponent,
    GooglePlaceResult,
    LatLngLiteral,
    LocationPickerAddress,
    LocationPickerAddressPatch,
} from "./location-picker.types.ts"

export const DEFAULT_CENTER: LatLngLiteral = {lat: 39.8283, lng: -98.5795}

type ResolvedAddressPatch = LocationPickerAddressPatch & Pick<LocationPickerAddress, "latitude" | "longitude">

export function getSelectedPosition(value: Pick<LocationPickerAddress, "latitude" | "longitude">) {
    if (!Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) {
        return null
    }

    if (value.latitude === 0 && value.longitude === 0) {
        return null
    }

    return {
        lat: value.latitude,
        lng: value.longitude,
    }
}

export function toAddressPatch(result: GooglePlaceResult, fallbackPosition?: LatLngLiteral): ResolvedAddressPatch | null {
    const position = getResultPosition(result) ?? fallbackPosition

    if (!position) return null

    const components = result.address_components ?? []
    const aptNumber = getComponent(components, "subpremise")

    return {
        ...(aptNumber ? {apt_number: aptNumber} : {}),
        street: getStreet(components) || result.formatted_address || "",
        city: getCity(components),
        state: getComponent(components, "administrative_area_level_1", "short_name"),
        country: getComponent(components, "country", "short_name"),
        zipcode: getPostalCode(components),
        latitude: position.lat,
        longitude: position.lng,
    }
}

export function formatAddressPatch(patch: LocationPickerAddressPatch) {
    return [
        patch.street,
        patch.city,
        patch.state,
        patch.country,
        patch.zipcode,
    ].filter(Boolean).join(", ")
}

function getResultPosition(result: GooglePlaceResult) {
    const location = result.geometry?.location

    if (!location) return null

    return {
        lat: location.lat(),
        lng: location.lng(),
    }
}

function getStreet(components: GoogleAddressComponent[]) {
    return [getComponent(components, "street_number"), getComponent(components, "route")]
        .filter(Boolean)
        .join(" ")
}

function getCity(components: GoogleAddressComponent[]) {
    return (
        getComponent(components, "locality") ||
        getComponent(components, "postal_town") ||
        getComponent(components, "sublocality_level_1") ||
        getComponent(components, "administrative_area_level_2")
    )
}

function getPostalCode(components: GoogleAddressComponent[]) {
    return [getComponent(components, "postal_code"), getComponent(components, "postal_code_suffix")]
        .filter(Boolean)
        .join("-")
}

function getComponent(
    components: GoogleAddressComponent[],
    type: string,
    field: "long_name" | "short_name" = "long_name"
) {
    return components.find((component) => component.types.includes(type))?.[field] ?? ""
}
