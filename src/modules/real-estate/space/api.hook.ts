import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import type {PageRequest} from "@/models/PagedModel.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import spaceApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace SpaceApiHook {
    export const useQuerySpaceTypes = (params?: PageRequest) =>
        useQuery({
            queryKey: RealEstateQueryKeys.spaceTypes(params),
            queryFn: () => spaceApi.queryTypes(params),
        })

    export const useGetSpaceType = (spaceTypeId: SpaceModel.SpaceTypeID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.spaceType(spaceTypeId),
            queryFn: () => spaceApi.getType(spaceTypeId),
        })

    export function useCreateSpaceType(successHandler?: SuccessHandler<SpaceModel.SpaceType>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (body: SpaceModel.CreateSpaceType) => spaceApi.createType(body),
            onSuccess: async (data) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spaceTypesRoot})
                successHandler?.(data)
            },
        })
    }

    export function useUpdateSpaceType(successHandler?: SuccessHandler<SpaceModel.SpaceType>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceTypeId, body}: { spaceTypeId: SpaceModel.SpaceTypeID, body: SpaceModel.UpdateSpaceType }) =>
                spaceApi.updateType(spaceTypeId, body),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spaceTypesRoot}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spaceType(variables.spaceTypeId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useDeleteSpaceType(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (spaceTypeId: SpaceModel.SpaceTypeID) => spaceApi.deleteType(spaceTypeId),
            onSuccess: async (_data, spaceTypeId) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spaceTypesRoot})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.spaceType(spaceTypeId)})
                successHandler?.()
            },
        })
    }

    export const useQuerySpacesByProperty = (propertyId: PropertyModel.PropertyID, params?: PageRequest) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertySpaces(propertyId, params),
            queryFn: () => spaceApi.queryByProperty(propertyId, params),
        })

    export const useGetSpace = (propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.spaceDetailed(spaceId),
            queryFn: () => spaceApi.getById(propertyId, spaceId),
        })

    export function useCreateSpace(successHandler?: SuccessHandler<SpaceModel.Space>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: SpaceModel.Create }) =>
                spaceApi.create(propertyId, body),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spacesRoot}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useUpdateSpace(successHandler?: SuccessHandler<SpaceModel.Space>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, spaceId, body}: { propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID, body: SpaceModel.Update }) =>
                spaceApi.update(propertyId, spaceId, body),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useAddSpaceTags(successHandler?: SuccessHandler<SpaceModel.Space>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, tagIds, propertyId}: { spaceId: SpaceModel.SpaceID, tagIds: SpaceModel.TagID[], propertyId?: PropertyModel.PropertyID }) =>
                spaceApi.addTags(spaceId, tagIds, propertyId),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                    variables.propertyId
                        ? queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                        : Promise.resolve(),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useRemoveSpaceTags(successHandler?: SuccessHandler<SpaceModel.Space>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, tagIds, propertyId}: { spaceId: SpaceModel.SpaceID, tagIds: SpaceModel.TagID[], propertyId?: PropertyModel.PropertyID }) =>
                spaceApi.removeTags(spaceId, tagIds, propertyId),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                    variables.propertyId
                        ? queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                        : Promise.resolve(),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useDeleteSpace(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, spaceId}: { propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID }) =>
                spaceApi.delete(propertyId, spaceId),
            onSuccess: async (_data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                    queryClient.removeQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                ])
                successHandler?.()
            },
        })
    }
}
