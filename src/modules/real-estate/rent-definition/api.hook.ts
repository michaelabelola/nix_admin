import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {RentDefinitionModel} from "@/modules/real-estate/rent-definition/model.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import rentDefinitionApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace RentDefinitionRequest {
    export const useQueryPropertyRents = (
        query: Parameters<typeof rentDefinitionApi.listByProperty>[0],
    ) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: [...RealEstateQueryKeys.propertyRents(query?.propertyId ?? ""), query],
                queryFn: () => rentDefinitionApi.listByProperty(query, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetPropertyRent = (propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyRent(propertyId, rentDefinitionId),
                queryFn: () => rentDefinitionApi.getByProperty(propertyId, rentDefinitionId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreatePropertyRent(successHandler?: SuccessHandler<RentDefinitionModel.RentDefinition>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, body}: {
                    propertyId: PropertyModel.PropertyID,
                    body: RentDefinitionModel.Create
                }) =>
                    rentDefinitionApi.createForProperty(propertyId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdatePropertyRent(successHandler?: SuccessHandler<RentDefinitionModel.RentDefinition>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, rentDefinitionId, body}: {
                    propertyId: PropertyModel.PropertyID,
                    rentDefinitionId: RentDefinitionModel.RentDefinitionID,
                    body: RentDefinitionModel.Update
                }) =>
                    rentDefinitionApi.updateForProperty(propertyId, rentDefinitionId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeletePropertyRent(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, rentDefinitionId}: {
                    propertyId: PropertyModel.PropertyID,
                    rentDefinitionId: RentDefinitionModel.RentDefinitionID
                }) =>
                    rentDefinitionApi.deleteForProperty(propertyId, rentDefinitionId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyRent(variables.propertyId, variables.rentDefinitionId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export function useSetPropertyDefaultRent(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, rentDefinitionId}: {
                    propertyId: PropertyModel.PropertyID,
                    rentDefinitionId: RentDefinitionModel.RentDefinitionID
                }) =>
                    rentDefinitionApi.setPropertyDefault(propertyId, rentDefinitionId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useClearPropertyDefaultRent(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (propertyId: PropertyModel.PropertyID) => rentDefinitionApi.clearPropertyDefault(propertyId, {errHandler}),
                onSuccess: async (data, propertyId) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export const useQuerySpaceRents = (spaceId: SpaceModel.SpaceID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spaceRents(spaceId),
                queryFn: () => rentDefinitionApi.listBySpace(spaceId, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetSpaceRent = (spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spaceRent(spaceId, rentDefinitionId),
                queryFn: () => rentDefinitionApi.getBySpace(spaceId, rentDefinitionId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreateSpaceRent(successHandler?: SuccessHandler<RentDefinitionModel.RentDefinition>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, body}: { spaceId: SpaceModel.SpaceID, body: RentDefinitionModel.Create }) =>
                    rentDefinitionApi.createForSpace(spaceId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateSpaceRent(successHandler?: SuccessHandler<RentDefinitionModel.RentDefinition>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, rentDefinitionId, body}: {
                    spaceId: SpaceModel.SpaceID,
                    rentDefinitionId: RentDefinitionModel.RentDefinitionID,
                    body: RentDefinitionModel.Update
                }) =>
                    rentDefinitionApi.updateForSpace(spaceId, rentDefinitionId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteSpaceRent(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, rentDefinitionId}: {
                    spaceId: SpaceModel.SpaceID,
                    rentDefinitionId: RentDefinitionModel.RentDefinitionID
                }) =>
                    rentDefinitionApi.deleteForSpace(spaceId, rentDefinitionId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.spaceRent(variables.spaceId, variables.rentDefinitionId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export function useSetSpaceDefaultRent(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, rentDefinitionId}: {
                    spaceId: SpaceModel.SpaceID,
                    rentDefinitionId: RentDefinitionModel.RentDefinitionID
                }) =>
                    rentDefinitionApi.setSpaceDefault(spaceId, rentDefinitionId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useClearSpaceDefaultRent(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (spaceId: SpaceModel.SpaceID) => rentDefinitionApi.clearSpaceDefault(spaceId, {errHandler}),
                onSuccess: async (data, spaceId) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useLinkRentsToSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, rentDefinitionIds}: {
                    spaceId: SpaceModel.SpaceID,
                    rentDefinitionIds: RentDefinitionModel.RentDefinitionID[]
                }) =>
                    rentDefinitionApi.linkToSpace(spaceId, rentDefinitionIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUnlinkRentsFromSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, rentDefinitionIds}: {
                    spaceId: SpaceModel.SpaceID,
                    rentDefinitionIds: RentDefinitionModel.RentDefinitionID[]
                }) =>
                    rentDefinitionApi.unlinkFromSpace(spaceId, rentDefinitionIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }
}
