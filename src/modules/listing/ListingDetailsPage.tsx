import {Link} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {
    DefinitionCard,
    EmptyState,
    KeyValue,
    SummaryMetric,
} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"
import {TagRequest} from "#/modules/tags/request.hook.ts"

import type {ListingModel} from "./model.ts"
import {ListingRequest} from "./request.hook.ts"
import {getListingStatusVariant} from "./table.tsx"

function formatDate(value?: Date | string | null) {
    if (!value) return null

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)

    return date.toLocaleString()
}

function ListingTags({listing}: { listing: ListingModel.Detailed }) {
    const tagIds = listing.tags ?? []
    const tagsQuery = TagRequest.useGetTagsBatch(tagIds)
    const tags = tagsQuery.data ?? []

    if (tagIds.length === 0) {
        return (
            <EmptyState
                title="No tags"
                description="This listing does not have any assigned tags."
            />
        )
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tagIds.map((tagId) => {
                const tag = tags.find((item) => item.id === tagId)

                return (
                    <Badge key={tagId} variant="outline">
                        {tag?.name || tagId}
                    </Badge>
                )
            })}
        </div>
    )
}

function ListingDetailsContent({listing}: { listing: ListingModel.Detailed }) {
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

export function ListingDetailsPage({listingId}: { listingId: ListingModel.ListingID }) {
    const query = ListingRequest.useGetListing(listingId)
    const data = query.data

    return (
        <Page
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            loading={{
                title: "Loading listing",
                description: "Fetching listing details.",
            }}
            header={{
                title: data?.title || "Listing",
                description: data?.description || "Review listing details and attached tags.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/real-estate/listings">
                                Back to listings
                            </Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            {!data ? (
                <EmptyState
                    title="Listing not found"
                    description="The requested listing could not be loaded."
                />
            ) : (
                <ListingDetailsContent listing={data}/>
            )}
        </Page>
    )
}
