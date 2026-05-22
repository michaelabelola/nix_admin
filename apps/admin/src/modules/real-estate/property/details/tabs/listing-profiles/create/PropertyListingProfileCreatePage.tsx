import type {PropertyModel} from "#/modules/real-estate/property/model.ts"

import {PropertyListingProfileCreateHeader} from "./PropertyListingProfileCreateHeader.tsx"
import {PropertyListingProfileFeaturesCard} from "./PropertyListingProfileFeaturesCard.tsx"
import {PropertyListingProfileLocationFieldsCard} from "./PropertyListingProfileLocationFieldsCard.tsx"
import {PropertyListingProfileMediaCard} from "./PropertyListingProfileMediaCard.tsx"
import {PropertyListingProfileSnapshotSourcesCard} from "./PropertyListingProfileSnapshotSourcesCard.tsx"
import {PropertyListingProfileTagsCard} from "./PropertyListingProfileTagsCard.tsx"
import {usePropertyListingProfileCreateForm} from "./usePropertyListingProfileCreateForm.ts"

export function PropertyListingProfileCreatePage({
    property,
    propertyId,
}: {
    property?: PropertyModel.Detailed
    propertyId: PropertyModel.PropertyID
}) {
    const form = usePropertyListingProfileCreateForm({
        property,
        propertyId,
    })

    return (
        <div className="space-y-6">
            <PropertyListingProfileCreateHeader
                disabled={!property?.id || form.isSubmitting}
                isSubmitting={form.isSubmitting}
                onBack={form.navigateBack}
                onCreate={form.handleCreate}
            />

            <PropertyListingProfileSnapshotSourcesCard
                isDefault={form.formState.isDefault}
                leaseId={form.formState.leaseId}
                leaseOptions={form.leaseOptions}
                onDefaultChange={form.setIsDefault}
                onLeaseChange={form.setLeaseId}
                onPricingChange={form.setPricingId}
                onRentChange={form.setRentId}
                pricingId={form.formState.pricingId}
                pricingOptions={form.pricingOptions}
                rentId={form.formState.rentId}
                rentOptions={form.rentOptions}
            />

            <PropertyListingProfileMediaCard
                avatarId={form.formState.avatarId}
                galleryIds={form.formState.galleryIds}
                isError={form.mediaIsError}
                isLoading={form.mediaIsLoading}
                items={form.mediaItems}
                property={property}
                onAvatarChange={form.setAvatarId}
                onGalleryItemChange={form.toggleGalleryItem}
            />

            <PropertyListingProfileTagsCard
                selectedTagIds={form.formState.tagIds}
                tags={form.assignedTags}
                toggleTag={form.toggleTag}
                unresolvedTagIds={form.unresolvedTagIds}
            />

            <PropertyListingProfileFeaturesCard
                features={form.availableFeatures}
                selectedFeatureIds={form.formState.featureIds}
                toggleFeature={form.toggleFeature}
            />

            <PropertyListingProfileLocationFieldsCard
                availableLocationFields={form.availableLocationFields}
                hasLocation={form.hasLocation}
                selectedLocation={form.formState.location}
                toggleLocationField={form.toggleLocationField}
            />
        </div>
    )
}
