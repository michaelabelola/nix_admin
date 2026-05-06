import {useQuery} from "@tanstack/react-query"

import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx"
import {RealEstateQueryKeys} from "#/modules/real-estate/query-keys.ts"

import propertyListingProfileApi from "./api.ts"
import type {PropertyListingProfileModel} from "./model.ts"

export namespace PropertyListingProfileApiHook {
    export const useQueryPropertyListingProfiles = (query?: PropertyListingProfileModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        const propertyId = query?.propertyID

        return {
            ...useQuery({
                queryKey: propertyId
                    ? [...RealEstateQueryKeys.propertyListingProfiles(propertyId), query]
                    : RealEstateQueryKeys.listingProfiles(query),
                queryFn: () => propertyListingProfileApi.query(query, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetPropertyListingProfile = (listingProfileId: PropertyListingProfileModel.ListingProfileID) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyListingProfile(listingProfileId),
                queryFn: () => propertyListingProfileApi.getById(listingProfileId, {errHandler}),
                enabled: Boolean(listingProfileId),
            }),
            errHandler,
        }
    }

    export const useGetDetailedPropertyListingProfile = (listingProfileId: PropertyListingProfileModel.ListingProfileID) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyListingProfileDetailed(listingProfileId),
                queryFn: () => propertyListingProfileApi.getDetailed(listingProfileId, {errHandler}),
                enabled: Boolean(listingProfileId),
            }),
            errHandler,
        }
    }

    export const useGetPropertyListingProfileListingIds = (listingProfileId: PropertyListingProfileModel.ListingProfileID) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyListingProfileListings(listingProfileId),
                queryFn: () => propertyListingProfileApi.getListingIds(listingProfileId, {errHandler}),
                enabled: Boolean(listingProfileId),
            }),
            errHandler,
        }
    }
}
