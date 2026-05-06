import {useMemo, useState} from "react"
import {useQueryClient} from "@tanstack/react-query"
import {Link, useNavigate} from "@tanstack/react-router"
import {ArrowLeft, ArrowRight, CheckIcon, EyeIcon, FileIcon, ImageIcon, PlusIcon} from "lucide-react"
import {toast} from "sonner"

import Page from "#/components/Page.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "#/components/ui/sheet.tsx"
import {Input} from "#/components/ui/input.tsx"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "#/components/ui/table.tsx"
import {Tabs, TabsList, TabsTrigger} from "#/components/ui/tabs.tsx"
import {NixModule} from "#/models/Models.ts"
import {ListingModel} from "#/modules/listing/model.ts"
import {ListingRequest, ListingQueryKeys} from "#/modules/listing/request.hook.ts"
import {getListingStatusVariant} from "#/modules/listing/table.tsx"
import {
    DefinitionCard,
    EmptyState,
    KeyValue,
    SummaryMetric
} from "#/modules/real-estate/property/details/PropertyDetailsPrimitives.tsx"
import {formatMoney} from "#/modules/real-estate/property/details/property-details.utils.ts"
import {RealEstateQueryKeys} from "#/modules/real-estate/query-keys.ts"
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

function ListingProfileListingsTab({listingProfileId}: { listingProfileId: PropertyListingProfileModel.ListingProfileID }) {
    const listingIdsQuery = PropertyListingProfileApiHook.useGetPropertyListingProfileListingIds(listingProfileId)
    const listingIds = useMemo(() => listingIdsQuery.data ?? [], [listingIdsQuery.data])
    const listingsQuery = ListingRequest.useGetListingsByIds(listingIds)
    const listingsById = useMemo(
        () => new Map(listingsQuery.data.map((listing) => [listing.id, listing])),
        [listingsQuery.data],
    )

    if (listingIdsQuery.isLoading || listingsQuery.isLoading) {
        return (
            <EmptyState
                title="Loading listings"
                description="Fetching listings attached to this listing profile."
            />
        )
    }

    if (listingIds.length === 0) {
        return (
            <EmptyState
                title="No listings"
                description="This listing profile has not been added to any listing."
            />
        )
    }

    return (
        <DefinitionCard
            title="Listings"
            description="Listings this property listing profile is part of."
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Listing</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listingIds.map((listingId) => {
                        const listing = listingsById.get(listingId)

                        return (
                            <TableRow key={listingId}>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="font-medium">{listing?.title || listingId}</div>
                                        <div className="line-clamp-2 text-muted-foreground">
                                            {listing?.description || "Listing details unavailable"}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getListingStatusVariant(listing?.status)}>
                                        {listing?.status || "STATUS_UNSET"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{listing?.type || "Not set"}</TableCell>
                                <TableCell>{listing?.module || "Not set"}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link to="/admin/listings/$listingId" params={{listingId}}>
                                            View
                                            <ArrowRight className="size-4"/>
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </DefinitionCard>
    )
}

function ListingProfileAddListingSheet({
                                           listingProfileId,
                                       }: {
    listingProfileId: PropertyListingProfileModel.ListingProfileID
}) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [search, setSearch] = useState("")
    const listingIdsQuery = PropertyListingProfileApiHook.useGetPropertyListingProfileListingIds(listingProfileId)
    const attachedListingIds = useMemo(() => new Set(listingIdsQuery.data ?? []), [listingIdsQuery.data])
    const listingsQuery: ReturnType<typeof ListingRequest.useQueryListings> = ListingRequest.useQueryListings({
        page: 0,
        size: 10,
        query: search.trim() || undefined,
        module: NixModule.REAL_ESTATE,
        type: "property",
    })
    const addItemToListing = ListingRequest.useAddItemToListing()

    function closeSheet() {
        void navigate({
            to: "/admin/real-estate/properties/listing-profiles/$listingProfileId/listings",
            params: {listingProfileId},
        })
    }

    function handleOpenChange(open: boolean) {
        if (!open) closeSheet()
    }

    async function handleAddListing(listing: ListingModel.Listing) {
        await addItemToListing.mutateAsync({
            listingId: listing.id,
            listingProfileId,
        })
        await Promise.all([
            queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyListingProfileListings(listingProfileId)}),
            queryClient.invalidateQueries({queryKey: ListingQueryKeys.detail(listing.id)}),
        ])
        toast.success("Listing profile added to listing.")
        closeSheet()
    }

    return (
        <Sheet open onOpenChange={handleOpenChange}>
            <SheetContent className="sm:max-w-3xl">
                <SheetHeader>
                    <SheetTitle>Add Listing Profile to Listing</SheetTitle>
                    <SheetDescription>
                        Choose a real estate property listing to attach this listing profile to.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 overflow-hidden px-4 pb-4">
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search listings..."
                    />

                    <div className="overflow-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Listing</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Module</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listingsQuery.data.content.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <EmptyState
                                                title={listingsQuery.isLoading ? "Loading listings" : "No listings found"}
                                                description="Only real estate property listings are shown here."
                                            />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    listingsQuery.data.content.map((listing) => {
                                        const isAttached = attachedListingIds.has(listing.id)

                                        return (
                                            <TableRow key={listing.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{listing.title || "Untitled listing"}</div>
                                                        <div className="line-clamp-2 text-muted-foreground">
                                                            {listing.description || "No description"}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getListingStatusVariant(listing.status)}>
                                                        {listing.status || "STATUS_UNSET"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{listing.module || "Not set"}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        disabled={listingIdsQuery.isLoading || isAttached || addItemToListing.isPending}
                                                        onClick={() => void handleAddListing(listing)}
                                                    >
                                                        {isAttached ? (
                                                            <>
                                                                <CheckIcon className="size-4"/>
                                                                Added
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PlusIcon className="size-4"/>
                                                                Add
                                                            </>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={closeSheet}>
                        Cancel
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
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
                                                      isAddListingOpen = false,
                                                  }: {
    activeTab?: "details" | "gallery" | "listings"
    listingProfileId: PropertyListingProfileModel.ListingProfileID
    isAddListingOpen?: boolean
}) {
    const navigate = useNavigate()
    const query = PropertyListingProfileApiHook.useGetDetailedPropertyListingProfile(listingProfileId)
    const data = query.data
    return (
        <Page
            isLoading={query.isLoading && !isAddListingOpen}
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
                                <ArrowLeft className="size-4"/>

                                Back to list
                            </Link>
                        </Button>
                        {data ? (
                            <Button variant="outline" asChild>
                                <Link
                                    to="/admin/real-estate/properties/listing-profiles/$listingProfileId/listings/add"
                                    params={{listingProfileId}}
                                >
                                    <PlusIcon className="size-4"/>
                                    Add Listing Profile to Listing
                                </Link>
                            </Button>
                        ) : null}
                        {data?.propertyID ? (
                            <Button variant={"outline"} asChild>
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
                                : value === "listings"
                                    ? "/admin/real-estate/properties/listing-profiles/$listingProfileId/listings"
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
                        <TabsTrigger value="listings" className="flex-none px-1.5 py-2">
                            Listings
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        {activeTab === "gallery" ? (
                            <ListingProfileGalleryTab profile={data}/>
                        ) : activeTab === "listings" ? (
                            <ListingProfileListingsTab listingProfileId={listingProfileId}/>
                        ) : (
                            <ListingProfileDetailsTab profile={data}/>
                        )}
                    </div>
                </Tabs>
            )}
            {isAddListingOpen ? (
                <ListingProfileAddListingSheet listingProfileId={listingProfileId}/>
            ) : null}
        </Page>
    )
}
