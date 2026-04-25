import {Link} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {DefinitionCard, EmptyState, KeyValue, SummaryMetric} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"
import {formatMoney} from "#/modules/real-estate/property/details/property-details.utils.ts"
import {PropertyListingProfileApiHook} from "#/modules/real-estate/property-listing-profile/api.hook.ts"
import type {PropertyListingProfileModel} from "#/modules/real-estate/property-listing-profile/model.ts"

import {formatListingProfileDefinitionValue, formatListingProfileLocation} from "./table.tsx"

function formatListingProfileFeatureValue(feature: PropertyListingProfileModel.Feature) {
    if (feature.booleanValue != null) return feature.booleanValue ? "Yes" : "No"
    if (feature.decimalValue != null) return `${feature.decimalValue}${feature.unit ? ` ${feature.unit}` : ""}`
    if (feature.stringValue) return feature.stringValue
    if (feature.textValue) return feature.textValue
    if (feature.timeValue) return feature.timeValue
    return null
}

export function PropertyListingProfileDetailsPage({
    listingProfileId,
}: {
    listingProfileId: PropertyListingProfileModel.ListingProfileID
}) {
    const query = PropertyListingProfileApiHook.useGetDetailedPropertyListingProfile(listingProfileId)
    const data = query.data

    return (
        <Page
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            loading={{
                title: "Loading listing profile",
                description: "Fetching listing profile details.",
            }}
            header={{
                avatar: data?.avatar || null,
                title: data?.name || "Listing Profile",
                description: data?.description || "Review the snapshot details for this listing profile.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/real-estate/properties/listing-profiles">
                                Back to list
                            </Link>
                        </Button>
                        {data?.propertyID ? (
                            <Button asChild>
                                <Link
                                    to="/admin/real-estate/properties/$propertyId/listing-profiles"
                                    params={{propertyId: data.propertyID}}
                                >
                                    Open property
                                </Link>
                            </Button>
                        ) : null}
                    </ButtonGroup>
                ),
            }}
        >
            {!data ? (
                <EmptyState
                    title="Listing profile not found"
                    description="The requested listing profile could not be loaded."
                />
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <SummaryMetric label="Profile ID" value={data.id}/>
                        <SummaryMetric label="Property ID" value={data.propertyID}/>
                        <SummaryMetric label="Type" value={data.type || "Not set"}/>
                        <SummaryMetric label="Default" value={data.isDefault ? "Yes" : "No"}/>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                        <DefinitionCard
                            title="Overview"
                            description="Core listing profile fields and descriptive content."
                        >
                            <div className="grid gap-3 md:grid-cols-2">
                                <KeyValue label="Name" value={data.name}/>
                                <KeyValue label="Description" value={data.description}/>
                                <KeyValue label="Price" value={formatMoney(data.price?.amount)}/>
                                <KeyValue label="Location" value={formatListingProfileLocation(data.location)}/>
                            </div>
                            <div className="mt-4 rounded-lg border p-4">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">About</div>
                                <p className="mt-2 text-sm whitespace-pre-wrap">
                                    {data.about || "Not set"}
                                </p>
                            </div>
                        </DefinitionCard>

                        <DefinitionCard
                            title="Tenancy"
                            description="Pricing and occupancy definitions captured in this snapshot."
                        >
                            <div className="grid gap-3">
                                <KeyValue label="Pricing" value={formatMoney(data.price?.amount)}/>
                                <KeyValue label="Rent" value={formatListingProfileDefinitionValue(data.rent)}/>
                                <KeyValue label="Lease" value={formatListingProfileDefinitionValue(data.lease)}/>
                            </div>
                        </DefinitionCard>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <DefinitionCard
                            title="Tags"
                            description="Tags copied into this listing profile."
                        >
                            {data.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {data.tags.map((tag) => (
                                        <Badge key={tag.id} variant="outline">
                                            {tag.name || tag.id}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    title="No tags"
                                    description="This listing profile does not contain any copied tags."
                                />
                            )}
                        </DefinitionCard>

                        <DefinitionCard
                            title="Location Snapshot"
                            description="Location fields copied from the source property."
                        >
                            {data.location ? (
                                <div className="grid gap-3 md:grid-cols-2">
                                    <KeyValue label="Apartment" value={data.location.apartment}/>
                                    <KeyValue label="Unit" value={data.location.unit}/>
                                    <KeyValue label="Building" value={data.location.building}/>
                                    <KeyValue label="Floor" value={data.location.floor != null ? String(data.location.floor) : null}/>
                                    <KeyValue label="Address line 1" value={data.location.line1}/>
                                    <KeyValue label="Address line 2" value={data.location.line2}/>
                                    <KeyValue label="City" value={data.location.city}/>
                                    <KeyValue label="State" value={data.location.state}/>
                                    <KeyValue label="Postal code" value={data.location.postalCode}/>
                                    <KeyValue label="Country" value={data.location.country}/>
                                    <KeyValue label="Latitude" value={data.location.loc_lat != null ? String(data.location.loc_lat) : null}/>
                                    <KeyValue label="Longitude" value={data.location.loc_long != null ? String(data.location.loc_long) : null}/>
                                </div>
                            ) : (
                                <EmptyState
                                    title="No location"
                                    description="This listing profile does not contain a location snapshot."
                                />
                            )}
                        </DefinitionCard>
                    </div>

                    <DefinitionCard
                        title="Features"
                        description="Feature values copied into this listing profile."
                    >
                        {data.features.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {data.features.map((feature) => (
                                    <Card key={feature.id}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base">{feature.name || feature.id}</CardTitle>
                                            <CardDescription>{feature.description || "No description"}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-3 text-sm">
                                            <KeyValue label="Format" value={feature.format}/>
                                            <KeyValue label="Value" value={formatListingProfileFeatureValue(feature) || "Not set"}/>
                                            <KeyValue label="Unit" value={feature.unit}/>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No features"
                                description="This listing profile does not contain any copied features."
                            />
                        )}
                    </DefinitionCard>
                </div>
            )}
        </Page>
    )
}
