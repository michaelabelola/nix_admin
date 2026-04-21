import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import type {PageRequest} from "@/models/PagedModel.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import spaceApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace SpaceApiHook {
    export const useQuerySpaceTypes = (params?: PageRequest) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spaceTypes(params),
                queryFn: () => spaceApi.queryTypes(params, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetSpaceType = (spaceTypeId: SpaceModel.SpaceTypeID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spaceType(spaceTypeId),
                queryFn: () => spaceApi.getType(spaceTypeId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreateSpaceType(successHandler?: SuccessHandler<SpaceModel.SpaceType>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: SpaceModel.CreateSpaceType) => spaceApi.createType(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spaceTypesRoot})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateSpaceType(successHandler?: SuccessHandler<SpaceModel.SpaceType>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceTypeId, body}: { spaceTypeId: SpaceModel.SpaceTypeID, body: SpaceModel.UpdateSpaceType }) =>
                    spaceApi.updateType(spaceTypeId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spaceTypesRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spaceType(variables.spaceTypeId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteSpaceType(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (spaceTypeId: SpaceModel.SpaceTypeID) => spaceApi.deleteType(spaceTypeId, {errHandler}),
                onSuccess: async (_data, spaceTypeId) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spaceTypesRoot})
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.spaceType(spaceTypeId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export const useQuerySpacesByProperty = (propertyId: PropertyModel.PropertyID, params?: PageRequest) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertySpaces(propertyId, params),
                queryFn: () => spaceApi.queryByProperty(propertyId, params, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetSpace = (propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spaceDetailed(spaceId),
                queryFn: () => spaceApi.getById(propertyId, spaceId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreateSpace(successHandler?: SuccessHandler<SpaceModel.Space>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: SpaceModel.Create }) =>
                    spaceApi.create(propertyId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.spacesRoot}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateSpace(successHandler?: SuccessHandler<SpaceModel.Space>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, spaceId, body}: { propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID, body: SpaceModel.Update }) =>
                    spaceApi.update(propertyId, spaceId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useAddSpaceTags(successHandler?: SuccessHandler<SpaceModel.Space>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, tagIds, propertyId}: { spaceId: SpaceModel.SpaceID, tagIds: SpaceModel.TagID[], propertyId?: PropertyModel.PropertyID }) =>
                    spaceApi.addTags(spaceId, tagIds, propertyId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                        variables.propertyId
                            ? queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                            : Promise.resolve(),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useRemoveSpaceTags(successHandler?: SuccessHandler<SpaceModel.Space>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, tagIds, propertyId}: { spaceId: SpaceModel.SpaceID, tagIds: SpaceModel.TagID[], propertyId?: PropertyModel.PropertyID }) =>
                    spaceApi.removeTags(spaceId, tagIds, propertyId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                        variables.propertyId
                            ? queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                            : Promise.resolve(),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteSpace(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, spaceId}: { propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID }) =>
                    spaceApi.delete(propertyId, spaceId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.removeQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                    ])
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}
