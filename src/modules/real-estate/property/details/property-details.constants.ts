export const PROPERTY_DETAILS_TABS = [
    "summary",
    "details",
    "about",
    "gallery",
    "location",
    "features",
    "tags",
    "rent",
    "lease",
    "pricing",
] as const

export type PropertyDetailsTab = (typeof PROPERTY_DETAILS_TABS)[number]

export const PROPERTY_DETAILS_TAB_LABELS: Record<PropertyDetailsTab, string> = {
    summary: "Summary",
    details: "Details",
    about: "About",
    gallery: "Gallery",
    location: "Location",
    features: "Features",
    tags: "Tags",
    rent: "Rent",
    lease: "Lease",
    pricing: "Pricing",
}

export const PROPERTY_DETAILS_TAB_TO: Record<PropertyDetailsTab, string> = {
    summary: "/admin/real-estate/properties/$propertyId/summary",
    location: "/admin/real-estate/properties/$propertyId/location",
    gallery: "/admin/real-estate/properties/$propertyId/gallery",
    about: "/admin/real-estate/properties/$propertyId/about",
    details: "/admin/real-estate/properties/$propertyId/details",
    tags: "/admin/real-estate/properties/$propertyId/tags",
    features: "/admin/real-estate/properties/$propertyId/features",
    rent: "/admin/real-estate/properties/$propertyId/rent",
    lease: "/admin/real-estate/properties/$propertyId/lease",
    pricing: "/admin/real-estate/properties/$propertyId/pricing",
}
