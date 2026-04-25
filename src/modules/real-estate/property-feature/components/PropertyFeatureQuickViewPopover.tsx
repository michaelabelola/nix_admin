import type {ReactNode} from "react"

import {Badge} from "#/components/ui/badge.tsx"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "#/components/ui/popover.tsx"
import {formatFeatureValue} from "#/modules/real-estate/property/details/property-details.utils.ts"
import type {PropertyFeatureModel} from "#/modules/real-estate/property-feature/model.ts"

export function PropertyFeatureQuickViewPopover({
    feature,
    children,
}: {
    feature?: PropertyFeatureModel.PropertyFeature
    children: ReactNode
}) {
    if (!feature) {
        return <>{children}</>
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-96 space-y-4">
                <PropertyFeatureQuickViewContent feature={feature}/>
            </PopoverContent>
        </Popover>
    )
}

export function PropertyFeatureQuickViewContent({feature}: { feature?: PropertyFeatureModel.PropertyFeature }) {
    if (!feature) return null

    return (
        <div className="space-y-4">
            <PopoverHeader>
                <PopoverTitle className="text-base">{feature.name || feature.id}</PopoverTitle>
                <PopoverDescription className="text-xs">
                    Feature ID: {feature.id}
                </PopoverDescription>
            </PopoverHeader>

            <p className="text-sm text-muted-foreground">
                {feature.description || "No description"}
            </p>

            <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Format</span>
                    <Badge variant="outline">{feature.format || "UNSET"}</Badge>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Value</span>
                    <span className="text-right">{formatFeatureValue(feature) || "Not set"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Unit</span>
                    <span>{feature.unit || "Not set"}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Tags: {feature.tags.length}</Badge>
                <Badge variant="secondary">Media: {feature.media.length}</Badge>
                <Badge variant="secondary">Files: {feature.files.length}</Badge>
            </div>
        </div>
    )
}
