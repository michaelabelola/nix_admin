import {useEffect, useMemo, useState} from "react"
import {useNavigate} from "@tanstack/react-router"
import {toast} from "sonner"

import {TagRequest} from "@suiteonix/server"
import type {TagModel} from "@suiteonix/server"
import {PropertyApiHook} from "@suiteonix/server"
import {LeaseDefinitionApiHook} from "@suiteonix/server"
import type {PropertyFeatureModel} from "@suiteonix/server"
import type {PropertyModel} from "@suiteonix/server"
import {PricingApiHook} from "@suiteonix/server"
import {RentDefinitionRequest} from "@suiteonix/server"
import {FilesStorageRequest} from "@suiteonix/server"
import type {FilesStorageModel} from "@suiteonix/server"

import {
    buildInitialFormState,
    EMPTY_OPTION,
    hasLocationFieldValue,
    LOCATION_FIELDS,
    type ListingProfileCreateFormState,
    type ListingProfileCreateLocationFieldKey,
} from "./property-listing-profile-create.shared.ts"

type SelectOption = {
    value: string
    label: string
}

export function usePropertyListingProfileCreateForm({
    property,
    propertyId,
}: {
    property?: PropertyModel.Detailed
    propertyId: PropertyModel.PropertyID
}) {
    const navigate = useNavigate()
    const [formState, setFormState] = useState<ListingProfileCreateFormState>(() => buildInitialFormState(property))

    const tagDetailsQuery = TagRequest.useGetTagsBatch(property?.tags ?? [])
    const pricingQuery = PricingApiHook.useQueryPropertyPricings({
        propertyId,
        page: 0,
        size: 100,
    })
    const rentQuery = RentDefinitionRequest.useQueryPropertyRents({
        propertyId,
        page: 0,
        size: 100,
    })
    const leaseQuery = LeaseDefinitionApiHook.useQueryPropertyLeases({
        propertyId,
        page: 0,
        size: 100,
    })
    const mediaQuery = FilesStorageRequest.useQueryStorageFiles(property?.storageID ?? undefined, {
        page: 0,
        size: 100,
        sort: [{field: "audit.createdDate", direction: "DESC"}],
    })
    const createListingProfile = PropertyApiHook.useCreatePropertyListingProfile(() => {
        toast.success("Listing profile created.")
        void navigate({
            to: "/admin/real-estate/properties/$propertyId/listing-profiles",
            params: {propertyId},
        })
    })

    useEffect(() => {
        setFormState(buildInitialFormState(property))
    }, [property?.id])

    useEffect(() => {
        const items = mediaQuery.data?.content ?? []
        if (!property?.id || formState.galleryIds.length > 0 || formState.avatarId || items.length === 0) return

        setFormState((prev) => ({
            ...prev,
            galleryIds: items.map((item) => item.id),
            avatarId: items[0]?.id ?? null,
        }))
    }, [formState.avatarId, formState.galleryIds.length, mediaQuery.data?.content, property?.id])

    const assignedTags = useMemo(() => {
        const lookup = new Map((tagDetailsQuery.data ?? []).map((tag) => [tag.id, tag] as const))
        return (property?.tags ?? []).map((tagId) => lookup.get(tagId)).filter(Boolean) as TagModel.Tag[]
    }, [property?.tags, tagDetailsQuery.data])

    const unresolvedTagIds = useMemo(
        () => (property?.tags ?? []).filter((tagId) => !assignedTags.some((tag) => tag.id === tagId)),
        [assignedTags, property?.tags],
    )

    const availableLocationFields = useMemo(
        () => LOCATION_FIELDS.filter((field) => hasLocationFieldValue(property?.location, field.key)),
        [property?.location],
    )

    const pricingOptions = useMemo<SelectOption[]>(
        () => (pricingQuery.data?.content ?? []).map((pricing) => ({value: String(pricing.id), label: pricing.name || String(pricing.id)})),
        [pricingQuery.data?.content],
    )
    const rentOptions = useMemo<SelectOption[]>(
        () => (rentQuery.data?.content ?? []).map((rent) => ({value: String(rent.id), label: rent.name || String(rent.id)})),
        [rentQuery.data?.content],
    )
    const leaseOptions = useMemo<SelectOption[]>(
        () => (leaseQuery.data?.content ?? []).map((lease) => ({value: String(lease.id), label: lease.name || String(lease.id)})),
        [leaseQuery.data?.content],
    )

    function updateSelection<T extends string>(values: T[], value: T, checked: boolean) {
        if (checked) {
            return values.includes(value) ? values : [...values, value]
        }

        return values.filter((item) => item !== value)
    }

    function setPricingId(pricingId: string) {
        setFormState((prev) => ({...prev, pricingId}))
    }

    function setRentId(rentId: string) {
        setFormState((prev) => ({...prev, rentId}))
    }

    function setLeaseId(leaseId: string) {
        setFormState((prev) => ({...prev, leaseId}))
    }

    function setIsDefault(isDefault: boolean) {
        setFormState((prev) => ({...prev, isDefault}))
    }

    function setAvatarId(avatarId: PropertyModel.FileID | null) {
        setFormState((prev) => ({...prev, avatarId}))
    }

    function toggleTag(tagId: PropertyModel.TagID, checked: boolean) {
        setFormState((prev) => ({
            ...prev,
            tagIds: updateSelection(prev.tagIds, tagId, checked),
        }))
    }

    function toggleFeature(featureId: PropertyFeatureModel.PropertyFeatureID, checked: boolean) {
        setFormState((prev) => ({
            ...prev,
            featureIds: updateSelection(prev.featureIds, featureId, checked),
        }))
    }

    function toggleGalleryItem(fileId: FilesStorageModel.FileID, checked: boolean) {
        setFormState((prev) => ({
            ...prev,
            galleryIds: updateSelection(prev.galleryIds, fileId, checked),
        }))
    }

    function toggleLocationField(key: ListingProfileCreateLocationFieldKey, checked: boolean) {
        setFormState((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [key]: checked,
            },
        }))
    }

    function handleCreate() {
        void createListingProfile.mutateAsync({
            propertyId,
            body: {
                tagIds: formState.tagIds,
                featureIds: formState.featureIds,
                pricingId: formState.pricingId !== EMPTY_OPTION ? formState.pricingId : undefined,
                rentId: formState.rentId !== EMPTY_OPTION ? formState.rentId : undefined,
                leaseId: formState.leaseId !== EMPTY_OPTION ? formState.leaseId : undefined,
                gallery: formState.galleryIds,
                avatar: formState.avatarId,
                location: availableLocationFields.length > 0 ? formState.location : undefined,
                isDefault: formState.isDefault,
            },
        })
    }

    function navigateBack() {
        void navigate({
            to: "/admin/real-estate/properties/$propertyId/listing-profiles",
            params: {propertyId},
        })
    }

    return {
        assignedTags,
        availableFeatures: property?.features ?? [],
        availableLocationFields,
        formState,
        handleCreate,
        hasLocation: Boolean(property?.location),
        isSubmitting: createListingProfile.isPending,
        leaseOptions,
        mediaItems: mediaQuery.data?.content ?? [],
        mediaIsLoading: mediaQuery.isLoading || mediaQuery.isFetching,
        mediaIsError: mediaQuery.isError,
        navigateBack,
        pricingOptions,
        rentOptions,
        setAvatarId,
        setIsDefault,
        setLeaseId,
        setPricingId,
        setRentId,
        toggleFeature,
        toggleGalleryItem,
        toggleLocationField,
        toggleTag,
        unresolvedTagIds,
    }
}
