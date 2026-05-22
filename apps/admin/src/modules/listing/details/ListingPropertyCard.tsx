import {Link} from "@tanstack/react-router"
import {ArrowRight, HomeIcon, MapPinIcon} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"

import type {ListingQuerierModel} from "@suiteonix/server"
import {
    formatDate,
    formatListingItemDefinition,
    formatListingItemLocation,
    formatListingItemMoney,
} from "./listing-details.utils.ts"

function ListingPropertyPreview({item}: { item: ListingQuerierModel.Response }) {
    if (!item.avatar) {
        return (
            <div className="grid aspect-[16/9] place-items-center bg-muted text-muted-foreground">
                <HomeIcon className="size-9"/>
            </div>
        )
    }

    return (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
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
    const visibleFeatures = (features ?? []).slice(0, 3)

    if (visibleFeatures.length === 0) return null

    return (
        <div className="flex flex-wrap gap-2">
            {visibleFeatures.map((feature, index) => (
                <span
                    key={`${feature.name}-${index}`}
                    className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
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
            <div className="truncate text-xs font-medium">{value || "Not set"}</div>
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
                    <Badge className="absolute left-2 top-2 bg-background/95 px-1.5 py-0.5 text-[11px] text-foreground shadow-sm hover:bg-background">
                        {item.type}
                    </Badge>
                ) : null}
            </div>

            <CardHeader className="gap-2 p-3 pb-2">
                <div className="space-y-1">
                    <div className="text-base font-semibold">
                        {price || "Price not set"}
                    </div>
                    <CardTitle className="line-clamp-1 text-sm">
                        {item.name?.trim() || item.id}
                    </CardTitle>
                    {location ? (
                        <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                            <MapPinIcon className="size-3.5 shrink-0"/>
                            <span className="truncate">{location}</span>
                        </div>
                    ) : null}
                </div>
                <CardDescription className="line-clamp-1 text-xs">
                    {item.description?.trim() || "No description"}
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 p-3 pt-0">
                <ListingPropertyFeatureList features={item.features}/>

                <div className="grid grid-cols-3 gap-2 border-t pt-3">
                    <ListingPropertyMeta label="Rent" value={formatListingItemDefinition(item.rent)}/>
                    <ListingPropertyMeta label="Lease" value={formatListingItemDefinition(item.lease)}/>
                    <ListingPropertyMeta label="Listed" value={formatDate(item.listedOn)}/>
                </div>

                <div className="flex justify-end">
                    <Button size="sm" variant="outline" className="h-8 px-2" asChild>
                        <Link
                            to="/admin/real-estate/properties/listing-profiles/$listingProfileId"
                            params={{listingProfileId: item.id}}
                        >
                            View
                            <ArrowRight className="size-3.5"/>
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
