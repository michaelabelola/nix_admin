import {Badge} from "#/components/ui/badge.tsx"
import {
    DefinitionCard,
    KeyValue,
    SummaryMetric,
} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"

import type {ListingModel} from "../model.ts"
import {getListingStatusVariant} from "../table.tsx"
import {formatDate} from "./listing-details.utils.ts"
import {ListingTags} from "./ListingTags.tsx"

export function ListingDetailsRecordTab({listing}: { listing: ListingModel.Detailed }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryMetric label="Listing ID" value={listing.id}/>
                <SummaryMetric label="Status" value={listing.status}/>
                <SummaryMetric label="Type" value={listing.type}/>
                <SummaryMetric label="Module" value={listing.module}/>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <DefinitionCard
                    title="Overview"
                    description="Core listing fields returned by the listing service."
                >
                    <div className="grid gap-3 md:grid-cols-2">
                        <KeyValue label="Title" value={listing.title}/>
                        <KeyValue
                            label="Status"
                            value={(
                                <Badge variant={getListingStatusVariant(listing.status)}>
                                    {listing.status || "STATUS_UNSET"}
                                </Badge>
                            )}
                        />
                        <KeyValue label="Type" value={listing.type}/>
                        <KeyValue label="Entity" value={listing.entityID}/>
                    </div>
                    <div className="mt-4 rounded-lg border p-4">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Description</div>
                        <p className="mt-2 whitespace-pre-wrap text-sm">
                            {listing.description || "Not set"}
                        </p>
                    </div>
                </DefinitionCard>

                <DefinitionCard
                    title="Audit"
                    description="Creation and modification metadata when provided by the API."
                >
                    <div className="grid gap-3">
                        <KeyValue label="Created by" value={listing.audit?.createdBy}/>
                        <KeyValue label="Created date" value={formatDate(listing.audit?.createdDate)}/>
                        <KeyValue label="Modified by" value={listing.audit?.modifiedBy}/>
                        <KeyValue label="Modified date" value={formatDate(listing.audit?.modifiedDate)}/>
                    </div>
                </DefinitionCard>
            </div>

            <DefinitionCard
                title="Tags"
                description="Tags attached to this listing record."
            >
                <ListingTags listing={listing}/>
            </DefinitionCard>
        </div>
    )
}
