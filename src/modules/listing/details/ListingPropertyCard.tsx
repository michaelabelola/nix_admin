import {Link} from "@tanstack/react-router"
import {ArrowRight, HomeIcon, MapPinIcon} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"

import type {ListingQuerierModel} from "../listing-querier.model.ts"
import {
    formatDate,
    formatListingItemDefinition,
    formatListingItemLocation,
    formatListingItemMoney,
} from "./listing-details.utils.ts"

function ListingPropertyPreview({item}: { item: ListingQuerierModel.Response }) {
    if (!item.avatar) {
        return (
            <div className="grid aspect-[16/10] place-items-center bg-muted text-muted-foreground">
                <HomeIcon className="size-12"/>
            </div>
        )
    }

    return (
        <div className="aspect-[16/10] overflow-hidden bg-muted">
            <img
                src={item.avatar}
                alt={item.name?.trim() || "Listed property"}
                className="size-full object-cover"
                loading="lazy"
            />
        </div>
    )
}

function ListingPropertyFeatureList({features}: { features?: ListingQuerierModel.ResponseFeature[] }) {
    const visibleFeatures = (features ?? []).slice(0, 4)

    if (visibleFeatures.length === 0) return null

    return (
        <div className="flex flex-wrap gap-2">
            {visibleFeatures.map((feature, index) => (
                <span
                    key={`${feature.name}-${index}`}
                    className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                >
                    {[feature.name, feature.value, feature.unit].filter(Boolean).join(": ")}
                </span>
            ))}
        </div>
    )
}

function ListingPropertyMeta({
                                 label,
                                 value,
                             }: {
    label: string
    value?: string | null
}) {
    return (
        <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="truncate text-sm font-medium">{value || "Not set"}</div>
        </div>
    )
}

export function ListingPropertyCard({item}: { item: ListingQuerierModel.Response }) {
    const location = formatListingItemLocation(item.location)
    const price = formatListingItemMoney(item.price)

    return (
        <Card className="overflow-hidden gap-0 transition-shadow hover:shadow-md">
            <div className="relative">
                <ListingPropertyPreview item={item}/>
                {item.type ? (
                    <Badge className="absolute left-3 top-3 bg-background/95 text-foreground shadow-sm hover:bg-background">
                        {item.type}
                    </Badge>
                ) : null}
            </div>

            <CardHeader className="gap-3 p-4 pb-3">
                <div className="space-y-1">
                    <div className="text-lg font-semibold">
                        {price || "Price not set"}
                    </div>
                    <CardTitle className="line-clamp-1 text-base">
                        {item.name?.trim() || item.id}
                    </CardTitle>
                    {location ? (
                        <div className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
                            <MapPinIcon className="size-4 shrink-0"/>
                            <span className="truncate">{location}</span>
                        </div>
                    ) : null}
                </div>
                <CardDescription className="line-clamp-2 min-h-10">
                    {item.description?.trim() || "No description"}
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 p-4 pt-0">
                <ListingPropertyFeatureList features={item.features}/>

                <div className="grid grid-cols-3 gap-3 border-t pt-4">
                    <ListingPropertyMeta label="Rent" value={formatListingItemDefinition(item.rent)}/>
                    <ListingPropertyMeta label="Lease" value={formatListingItemDefinition(item.lease)}/>
                    <ListingPropertyMeta label="Listed" value={formatDate(item.listedOn)}/>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 text-xs text-muted-foreground">
                        <span className="truncate">Profile {item.id}</span>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                        <Link
                            to="/admin/real-estate/properties/listing-profiles/$listingProfileId"
                            params={{listingProfileId: item.id}}
                        >
                            View
                            <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
