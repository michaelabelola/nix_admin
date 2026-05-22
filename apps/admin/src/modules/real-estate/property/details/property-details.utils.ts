import type {LeaseDefinitionModel} from "#/modules/real-estate/lease-definition/model.ts";
import type {RealEstatePricingModel} from "#/modules/real-estate/pricing/model.ts";
import type {PropertyFeatureModel} from "#/modules/real-estate/property-feature/model.ts";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";
import type {RentDefinitionModel} from "#/modules/real-estate/rent-definition/model.ts";

export function formatLocation(location?: PropertyModel.PropertyLocation | PropertyModel.PropertyLocationDetailed | null) {
    if (!location) return null

    const parts = [
        location.line1,
        location.line2,
        location.city,
        location.state,
        location.postalCode,
        location.country,
    ].filter(Boolean)

    return parts.length ? parts.join(", ") : location.label
}

export function getGoogleMapsEmbedUrl(location?: PropertyModel.PropertyLocationDetailed | null) {
    if (!location) return null

    if (location.latitude != null && location.longitude != null) {
        return `https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`
    }

    const address = formatLocation(location)
    if (!address) return null

    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
}

export function formatMoney(
    money?: RealEstatePricingModel.RealEstatePricing["amount"] | RentDefinitionModel.RentDefinition["amount"] | LeaseDefinitionModel.LeaseDefinition["amount"] | null,
) {
    if (!money) return null

    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: money.currencyCode,
            maximumFractionDigits: 2,
        }).format(money.amount)
    } catch {
        return `${money.amount} ${money.currencyCode}`
    }
}

export function formatDuration(duration?: number | null, unit?: string | null) {
    if (duration == null && !unit) return "Not set"
    if (duration == null) return unit ?? "Not set"
    if (!unit) return String(duration)
    return `${duration} ${unit.toLowerCase()}${duration === 1 ? "" : "s"}`
}

export function formatDefinitionAmount(
    definition?: RentDefinitionModel.RentDefinition | LeaseDefinitionModel.LeaseDefinition | null,
) {
    if (!definition) return null

    const amount = formatMoney(definition.amount)
    const duration = formatDuration(definition.duration, definition.durationUnit)
    const negotiable = definition.negotiable ? "negotiable" : null

    const value = amount && duration !== "Not set" ? `${amount} / ${duration}` : amount ?? duration
    return [value, negotiable].filter(Boolean).join(" · ")
}

export function formatPricingDefinition(
    definition?: RealEstatePricingModel.RealEstatePricing | null,
) {
    if (!definition) return null

    const amount = formatMoney(definition.amount)
    const negotiable = definition.negotiable ? "negotiable" : null

    return [amount, negotiable].filter(Boolean).join(" · ") || null
}

export function formatFeatureValue(feature: PropertyFeatureModel.PropertyFeature) {
    if (feature.booleanValue != null) return feature.booleanValue ? "Yes" : "No"
    if (feature.decimalValue != null) return `${feature.decimalValue}${feature.unit ? ` ${feature.unit}` : ""}`
    if (feature.stringValue) return feature.stringValue
    if (feature.textValue) return feature.textValue
    if (feature.timeValue) return feature.timeValue
    return null
}
