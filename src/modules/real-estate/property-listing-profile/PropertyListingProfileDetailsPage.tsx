import {Link, useNavigate} from "@tanstack/react-router"
import {EyeIcon, FileIcon, ImageIcon} from "lucide-react"

import Page from "#/components/Page.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {Tabs, TabsList, TabsTrigger} from "#/components/ui/tabs.tsx"
import {
    DefinitionCard,
    EmptyState,
    KeyValue,
    SummaryMetric
} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"
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

function ListingProfileAvatarPreview({profile}: { profile: PropertyListingProfileModel.Detailed }) {
    if (!profile.avatar) return null

    return (
        <div className="mb-4 overflow-hidden rounded-lg border bg-muted">
            <div className="aspect-[16/9]">
                <img
                    src={profile.avatar}
                    alt={profile.name?.trim() || "Listing profile avatar"}
                    className="size-full object-cover"
                />
            </div>
        </div>
    )
}

function ListingProfileGalleryPreview({item}: { item: PropertyListingProfileModel.GalleryItem }) {
    const previewSrc = item.thumbnail || item.file

    if (!previewSrc) {
        return (
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <ImageIcon className="size-10"/>
            </div>
        )
    }

    return (
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <img
                src={previewSrc}
                alt={item.name?.trim() || "Listing profile gallery item"}
                className="size-full object-cover"
                loading="lazy"
            />
        </div>
    )
}

function ListingProfileGalleryTab({profile}: { profile: PropertyListingProfileModel.Detailed }) {
    if (!profile.gallery || profile?.gallery?.length === 0) {
        return (
            <EmptyState
                title="No gallery items"
                description="This listing profile does not contain any copied gallery items."
            />
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-4 2xl:grid-cols-5">
            {profile.gallery.map((item) => (
                <Card key={item.id} className="gap-4">
                    <CardHeader className="px-4">
                        <ListingProfileGalleryPreview item={item}/>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="text-base">
                                    {item.name?.trim() || item.id}
                                </CardTitle>
                                {item.isCoverImage ? <Badge>Cover</Badge> : null}
                            </div>
                            <CardDescription className="line-clamp-3 min-h-6">
                                {item.description?.trim() || "No description"}
                            </CardDescription>
                        </div>

                        {/*<div className="grid gap-3">*/}
                        {/*    <KeyValue label="File ID" value={item.id}/>*/}
                        {/*</div>*/}

                        <div className="flex flex-wrap gap-2">
                            {item.file ? (
                                <Button asChild variant="outline" size="sm">
                                    <a href={item.file} target="_blank" rel="noreferrer">
                                        <FileIcon className="size-4"/>
                                        Open file
                                    </a>
                                </Button>
                            ) : null}
                            {item.file ? (
                                <Button asChild variant="outline" size="sm">
                                    <a href={item.file} target="_blank" rel="noreferrer">
                                        <EyeIcon className="size-4"/>
                                        Open file
                                    </a>
                                </Button>
                            ) : null}
                            {item.thumbnail && item.thumbnail !== item.file ? (
                                <Button asChild variant="ghost" size="sm">
                                    <a href={item.thumbnail} target="_blank" rel="noreferrer">
                                        Open thumbnail
                                    </a>
                                </Button>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function ListingProfileDetailsTab({profile}: { profile: PropertyListingProfileModel.Detailed }) {
    if (profile == null) return null;
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryMetric label="Profile ID" value={profile.id}/>
                <SummaryMetric label="Property ID" value={profile.propertyID}/>
                <SummaryMetric label="Type" value={profile.type || "Not set"}/>
                <SummaryMetric label="Default" value={profile.isDefault ? "Yes" : "No"}/>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <DefinitionCard
                    title="Overview"
                    description="Core listing profile fields and descriptive content."
                >
                    <ListingProfileAvatarPreview profile={profile}/>
                    <div className="grid gap-3 md:grid-cols-2">
                        <KeyValue label="Name" value={profile.name}/>
                        <KeyValue label="Description" value={profile.description}/>
                        <KeyValue label="Price" value={formatMoney(profile.price?.amount)}/>
                        <KeyValue label="Location" value={formatListingProfileLocation(profile.location)}/>
                    </div>
                    <div className="mt-4 rounded-lg border p-4">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">About</div>
                        <p className="mt-2 text-sm whitespace-pre-wrap">
                            {profile.about || "Not set"}
                        </p>
                    </div>
                </DefinitionCard>

                <DefinitionCard
                    title="Tenancy"
                    description="Pricing and occupancy definitions captured in this snapshot."
                >
                    <div className="grid gap-3">
                        <KeyValue label="Pricing" value={formatMoney(profile.price?.amount)}/>
                        <KeyValue label="Rent" value={formatListingProfileDefinitionValue(profile.rent)}/>
                        <KeyValue label="Lease" value={formatListingProfileDefinitionValue(profile.lease)}/>
                    </div>
                </DefinitionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <DefinitionCard
                    title="Tags"
                    description="Tags copied into this listing profile."
                >
                    {profile?.tags?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.tags.map((tag) => (
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
                    {profile.location ? (
                        <div className="grid gap-3 md:grid-cols-2">
                            <KeyValue label="Apartment" value={profile.location.apartment}/>
                            <KeyValue label="Unit" value={profile.location.unit}/>
                            <KeyValue label="Building" value={profile.location.building}/>
                            <KeyValue label="Floor"
                                      value={profile.location.floor != null ? String(profile.location.floor) : null}/>
                            <KeyValue label="Address line 1" value={profile.location.line1}/>
                            <KeyValue label="Address line 2" value={profile.location.line2}/>
                            <KeyValue label="City" value={profile.location.city}/>
                            <KeyValue label="State" value={profile.location.state}/>
                            <KeyValue label="Postal code" value={profile.location.postalCode}/>
                            <KeyValue label="Country" value={profile.location.country}/>
                            <KeyValue label="Latitude"
                                      value={profile.location.loc_lat != null ? String(profile.location.loc_lat) : null}/>
                            <KeyValue label="Longitude"
                                      value={profile.location.loc_long != null ? String(profile.location.loc_long) : null}/>
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
                {profile?.features?.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {profile.features.map((feature) => (
                            <Card key={feature.id}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">{feature.name || feature.id}</CardTitle>
                                    <CardDescription>{feature.description || "No description"}</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-3 text-sm">
                                    <KeyValue label="Format" value={feature.format}/>
                                    <KeyValue label="Value"
                                              value={formatListingProfileFeatureValue(feature) || "Not set"}/>
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
    )
}

export function PropertyListingProfileDetailsPage({
                                                      activeTab = "details",
                                                      listingProfileId,
                                                  }: {
    activeTab?: "details" | "gallery"
    listingProfileId: PropertyListingProfileModel.ListingProfileID
}) {
    const navigate = useNavigate()
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
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => {
                        void navigate({
                            to: value === "gallery"
                                ? "/admin/real-estate/properties/listing-profiles/$listingProfileId/gallery"
                                : "/admin/real-estate/properties/listing-profiles/$listingProfileId",
                            params: {listingProfileId},
                        })
                    }}
                    className="gap-6 min-h-full"
                >
                    <TabsList variant="line" className="h-auto w-full flex-wrap justify-start rounded-none p-0">
                        <TabsTrigger value="details" className="flex-none px-1.5 py-2">
                            Details
                        </TabsTrigger>
                        <TabsTrigger value="gallery" className="flex-none px-1.5 py-2">
                            Gallery
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        {activeTab === "gallery" ? (
                            <ListingProfileGalleryTab profile={data}/>
                        ) : (
                            <ListingProfileDetailsTab profile={data}/>
                        )}
                    </div>
                </Tabs>
            )}
        </Page>
    )
}
