import {useEffect, useMemo, useState} from "react"
import {useNavigate} from "@tanstack/react-router"
import {toast} from "sonner"

import {TagRequest} from "#/modules/tags/request.hook.ts"
import type {TagModel} from "#/modules/tags/model.ts"
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts"
import {LeaseDefinitionApiHook} from "#/modules/real-estate/lease-definition/api.hook.ts"
import type {PropertyFeatureModel} from "#/modules/real-estate/property-feature/model.ts"
import type {PropertyModel} from "#/modules/real-estate/property/model.ts"
import {PricingApiHook} from "#/modules/real-estate/pricing/api.hook.ts"
import {RentDefinitionRequest} from "#/modules/real-estate/rent-definition/api.hook.ts"

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
        () => (pricingQuery.data?.content ?? []).map((pricing) => ({value: String(pricing.id), label: String(pricing.id)})),
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
        navigateBack,
        pricingOptions,
        rentOptions,
        setIsDefault,
        setLeaseId,
        setPricingId,
        setRentId,
        toggleFeature,
        toggleLocationField,
        toggleTag,
        unresolvedTagIds,
    }
}

