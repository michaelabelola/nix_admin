import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {PageRequest} from "@/models/PagedModel.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import propertyApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace PropertyApiHook {
    export const useQueryProperties = (params?: PageRequest) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.properties(params),
                queryFn: () => propertyApi.query(params, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetProperty = (propertyId: PropertyModel.PropertyID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyRecord(propertyId),
                queryFn: () => propertyApi.getById(propertyId, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetDetailedProperty = (propertyId: PropertyModel.PropertyID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyDetailed(propertyId),
                queryFn: () => propertyApi.getDetailed(propertyId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreateProperty(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: PropertyModel.Create) => propertyApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateProperty(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: PropertyModel.Update }) =>
                    propertyApi.update(propertyId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useFinishPropertyOnboarding(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (propertyId: PropertyModel.PropertyID) => propertyApi.finishOnboarding(propertyId, {errHandler}),
                onSuccess: async (data, propertyId) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUploadPropertyAvatar(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, file, part}: { propertyId: PropertyModel.PropertyID, file: File, part?: "image" | "avatar" }) =>
                    propertyApi.uploadAvatar(propertyId, file, part, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useInitializePropertyFilesStorage(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (propertyId: PropertyModel.PropertyID) => propertyApi.initializeFilesStorage(propertyId, {errHandler}),
                onSuccess: async (data, propertyId) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useAddPropertyTags(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, tagIds}: { propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[] }) =>
                    propertyApi.addTags(propertyId, tagIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useRemovePropertyTags(successHandler?: SuccessHandler<PropertyModel.Property>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, tagIds}: { propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[] }) =>
                    propertyApi.removeTags(propertyId, tagIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteProperty(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (propertyId: PropertyModel.PropertyID) => propertyApi.delete(propertyId, {errHandler}),
                onSuccess: async (_data, propertyId) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertiesRoot})
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.property(propertyId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export const useQueryPropertyLocations = (params?: PageRequest) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyLocations(params),
                queryFn: () => propertyApi.queryLocations(params, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetPropertyLocation = (locationId: PropertyModel.PropertyLocationID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyLocation(locationId),
                queryFn: () => propertyApi.getLocation(locationId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreatePropertyLocation(successHandler?: SuccessHandler<PropertyModel.PropertyLocation>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: PropertyModel.PropertyLocationCreate) => propertyApi.createLocation(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLocationsRoot})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdatePropertyLocation(successHandler?: SuccessHandler<PropertyModel.PropertyLocation>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({locationId, body}: { locationId: PropertyModel.PropertyLocationID, body: PropertyModel.PropertyLocationUpdate }) =>
                    propertyApi.updateLocation(locationId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLocationsRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLocation(variables.locationId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeletePropertyLocation(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (locationId: PropertyModel.PropertyLocationID) => propertyApi.deleteLocation(locationId, {errHandler}),
                onSuccess: async (_data, locationId) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLocationsRoot})
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyLocation(locationId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}
