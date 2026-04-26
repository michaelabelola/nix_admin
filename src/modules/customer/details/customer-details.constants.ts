export const CUSTOMER_DETAILS_TABS = [
    "summary",
    "details",
    "tags",
] as const

export type CustomerDetailsTab = (typeof CUSTOMER_DETAILS_TABS)[number]

export const CUSTOMER_DETAILS_TAB_LABELS: Record<CustomerDetailsTab, string> = {
    summary: "Summary",
    details: "Details",
    tags: "Tags",
}

export const CUSTOMER_DETAILS_TAB_TO: Record<CustomerDetailsTab, string> = {
    summary: "/admin/customers/$customerId/summary",
    details: "/admin/customers/$customerId/details",
    tags: "/admin/customers/$customerId/tags",
}
