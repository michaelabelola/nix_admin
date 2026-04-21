import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import propertyApi from "./api.ts";
import type {PageRequest} from "@/models/PagedModel.ts";

type SuccessHandler<T> = (data: T) => void

export namespace PropertyApiHook {
    export const useQueryProperties = (params?: PageRequest) =>
        useQuery({
            queryKey: RealEstateQueryKeys.properties(params),
            queryFn: () => propertyApi.query(params),
        })

    export const useGetProperty = (propertyId: PropertyModel.PropertyID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyRecord(propertyId),
            queryFn: () => propertyApi.getById(propertyId),
        })

    export const useGetDetailedProperty = (propertyId: PropertyModel.PropertyID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyDetailed(propertyId),
            queryFn: () => propertyApi.getDetailed(propertyId),
        })

    export function useCreateProperty(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (body: PropertyModel.Create) => propertyApi.create(body),
            onSuccess: async (data) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot})
                successHandler?.(data)
            },
        })
    }

    export function useUpdateProperty(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: PropertyModel.Update }) =>
                propertyApi.update(propertyId, body),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useUploadPropertyAvatar(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, file, part}: { propertyId: PropertyModel.PropertyID, file: File, part?: "image" | "avatar" }) =>
                propertyApi.uploadAvatar(propertyId, file, part),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useInitializePropertyFilesStorage(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (propertyId: PropertyModel.PropertyID) => propertyApi.initializeFilesStorage(propertyId),
            onSuccess: async (data, propertyId) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useAddPropertyTags(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, tagIds}: { propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[] }) =>
                propertyApi.addTags(propertyId, tagIds),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useRemovePropertyTags(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, tagIds}: { propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[] }) =>
                propertyApi.removeTags(propertyId, tagIds),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useDeleteProperty(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (propertyId: PropertyModel.PropertyID) => propertyApi.delete(propertyId),
            onSuccess: async (_data, propertyId) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.property(propertyId)})
                successHandler?.()
            },
        })
    }

    export const useQueryPropertyLocations = (params?: PageRequest) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyLocations(params),
            queryFn: () => propertyApi.queryLocations(params),
        })

    export const useGetPropertyLocation = (locationId: PropertyModel.PropertyLocationID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyLocation(locationId),
            queryFn: () => propertyApi.getLocation(locationId),
        })

    export function useCreatePropertyLocation(successHandler?: SuccessHandler<PropertyModel.PropertyLocation>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (body: PropertyModel.PropertyLocationCreate) => propertyApi.createLocation(body),
            onSuccess: async (data) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLocationsRoot})
                successHandler?.(data)
            },
        })
    }

    export function useUpdatePropertyLocation(successHandler?: SuccessHandler<PropertyModel.PropertyLocation>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({locationId, body}: { locationId: PropertyModel.PropertyLocationID, body: PropertyModel.PropertyLocationUpdate }) =>
                propertyApi.updateLocation(locationId, body),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLocationsRoot}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLocation(variables.locationId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useDeletePropertyLocation(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (locationId: PropertyModel.PropertyLocationID) => propertyApi.deleteLocation(locationId),
            onSuccess: async (_data, locationId) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLocationsRoot})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyLocation(locationId)})
                successHandler?.()
            },
        })
    }
}
