import type {ListingQuerierModel} from "@suiteonix/server"

export function formatDate(value?: Date | string | null) {
    if (!value) return null

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)

    return date.toLocaleString()
}

export function formatListingItemLocation(location?: ListingQuerierModel.ResponseLocation | null) {
    if (!location) return null

    const parts = [
        location.city,
        location.state,
        location.postalCode,
        location.country,
    ].filter(Boolean)

    return parts.length ? parts.join(", ") : null
}

export function formatListingItemDefinition(
    definition?: ListingQuerierModel.ResponseRent | ListingQuerierModel.ResponseLease | null,
) {
    if (!definition) return null

    const amount = formatListingItemMoney(definition)
    const duration = definition.duration && definition.durationUnit
        ? `${definition.duration} ${definition.durationUnit.toLowerCase()}${definition.duration === 1 ? "" : "s"}`
        : null

    return [amount, duration].filter(Boolean).join(" / ") || null
}

export function formatListingItemMoney(
    money?: Pick<ListingQuerierModel.ResponseRent, "amount" | "currencyCode"> | null,
) {
    if (!money?.currencyCode || money.amount == null) return null

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
