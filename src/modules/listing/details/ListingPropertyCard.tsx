import {Link} from "@tanstack/react-router"
import {ArrowRight, HomeIcon, MapPinIcon} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {KeyValue} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"

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
            <div className="grid aspect-[4/3] place-items-center bg-muted text-muted-foreground">
                <HomeIcon className="size-10"/>
            </div>
        )
    }

    return (
        <div className="aspect-[4/3] overflow-hidden bg-muted">
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
                <Badge key={`${feature.name}-${index}`} variant="outline">
                    {[feature.name, feature.value, feature.unit].filter(Boolean).join(": ")}
                </Badge>
            ))}
        </div>
    )
}

export function ListingPropertyCard({item}: { item: ListingQuerierModel.Response }) {
    const location = formatListingItemLocation(item.location)

    return (
        <Card className="overflow-hidden gap-0">
            <ListingPropertyPreview item={item}/>
            <CardHeader className="gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                        <CardTitle className="line-clamp-2 text-base">
                            {item.name?.trim() || item.id}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                            {item.description?.trim() || "No description"}
                        </CardDescription>
                    </div>
                    {item.type ? <Badge variant="secondary">{item.type}</Badge> : null}
                </div>
                {location ? (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPinIcon className="size-4 shrink-0"/>
                        <span className="truncate">{location}</span>
                    </div>
                ) : null}
            </CardHeader>
            <CardContent className="grid gap-4 p-4 pt-0">
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <KeyValue label="Price" value={formatListingItemMoney(item.price)}/>
                    <KeyValue label="Listed" value={formatDate(item.listedOn)}/>
                    <KeyValue label="Rent" value={formatListingItemDefinition(item.rent)}/>
                    <KeyValue label="Lease" value={formatListingItemDefinition(item.lease)}/>
                </div>

                <ListingPropertyFeatureList features={item.features}/>

                <div className="flex justify-end">
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
