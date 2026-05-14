import type {CustomerModel} from "#/modules/customer/model.ts"

export function getCustomerAvatarUrl(avatar?: CustomerModel.CustomerAvatar) {
    if (!avatar) return null
    if (typeof avatar === "string") return avatar
    return avatar.url ?? null
}

export function getCustomerDisplayName(customer?: Pick<CustomerModel.Detailed, "displayName" | "customerNumber" | "id"> | Pick<CustomerModel.Customer, "displayName" | "id">) {
    return customer?.displayName?.trim() || ("customerNumber" in (customer || {}) ? (customer as any)?.customerNumber : null) || customer?.id || "Unnamed customer"
}

export function formatCustomerAddress(address?: CustomerModel.Address | null) {
    if (!address) return null

    const parts = [
        address.line1,
        address.line2,
        address.city,
        address.state || address.province,
        address.postalCode,
        address.country,
    ].filter(Boolean)

    return parts.length ? parts.join(", ") : address.label || null
}

export function formatAuditDate(value?: string | Date | null) {
    if (!value) return null

    try {
        const date = typeof value === "string" ? new Date(value) : value
        if (Number.isNaN(date.getTime())) return String(value)

        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date)
    } catch {
        return String(value)
    }
}

export const customerStatusBadgeVariant: Record<
    CustomerModel.CustomerStatus,
    "default" | "secondary" | "outline" | "destructive"
> = {
    ACTIVE: "default",
    INACTIVE: "secondary",
    SUSPENDED: "outline",
    DELETED: "destructive",
}
