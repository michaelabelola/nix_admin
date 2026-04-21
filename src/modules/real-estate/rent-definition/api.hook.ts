import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {RentDefinitionModel} from "@/modules/real-estate/rent-definition/model.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import rentDefinitionApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace RentDefinitionApiHook {
    export const useQueryPropertyRents = (propertyId: PropertyModel.PropertyID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyRents(propertyId),
            queryFn: () => rentDefinitionApi.listByProperty(propertyId),
        })

    export const useGetPropertyRent = (propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyRent(propertyId, rentDefinitionId),
            queryFn: () => rentDefinitionApi.getByProperty(propertyId, rentDefinitionId),
        })

    export function useCreatePropertyRent(successHandler?: SuccessHandler<RentDefinitionModel.RentDefinition>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: RentDefinitionModel.Create }) =>
                rentDefinitionApi.createForProperty(propertyId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useUpdatePropertyRent(successHandler?: SuccessHandler<RentDefinitionModel.RentDefinition>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, rentDefinitionId, body}: { propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, body: RentDefinitionModel.Update }) =>
                rentDefinitionApi.updateForProperty(propertyId, rentDefinitionId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useDeletePropertyRent(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, rentDefinitionId}: { propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID }) =>
                rentDefinitionApi.deleteForProperty(propertyId, rentDefinitionId),
            onSuccess: async (_data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyRent(variables.propertyId, variables.rentDefinitionId)})
                successHandler?.()
            },
        })
    }

    export function useSetPropertyDefaultRent(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, rentDefinitionId}: { propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID }) =>
                rentDefinitionApi.setPropertyDefault(propertyId, rentDefinitionId),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useClearPropertyDefaultRent(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (propertyId: PropertyModel.PropertyID) => rentDefinitionApi.clearPropertyDefault(propertyId),
            onSuccess: async (data, propertyId) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)})
                successHandler?.(data)
            },
        })
    }

    export const useQuerySpaceRents = (spaceId: SpaceModel.SpaceID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.spaceRents(spaceId),
            queryFn: () => rentDefinitionApi.listBySpace(spaceId),
        })

    export const useGetSpaceRent = (spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.spaceRent(spaceId, rentDefinitionId),
            queryFn: () => rentDefinitionApi.getBySpace(spaceId, rentDefinitionId),
        })

    export function useCreateSpaceRent(successHandler?: SuccessHandler<RentDefinitionModel.RentDefinition>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, body}: { spaceId: SpaceModel.SpaceID, body: RentDefinitionModel.Create }) =>
                rentDefinitionApi.createForSpace(spaceId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useUpdateSpaceRent(successHandler?: SuccessHandler<RentDefinitionModel.RentDefinition>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, rentDefinitionId, body}: { spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, body: RentDefinitionModel.Update }) =>
                rentDefinitionApi.updateForSpace(spaceId, rentDefinitionId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useDeleteSpaceRent(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, rentDefinitionId}: { spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID }) =>
                rentDefinitionApi.deleteForSpace(spaceId, rentDefinitionId),
            onSuccess: async (_data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.spaceRent(variables.spaceId, variables.rentDefinitionId)})
                successHandler?.()
            },
        })
    }

    export function useSetSpaceDefaultRent(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, rentDefinitionId}: { spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID }) =>
                rentDefinitionApi.setSpaceDefault(spaceId, rentDefinitionId),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useClearSpaceDefaultRent(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (spaceId: SpaceModel.SpaceID) => rentDefinitionApi.clearSpaceDefault(spaceId),
            onSuccess: async (data, spaceId) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useLinkRentsToSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, rentDefinitionIds}: { spaceId: SpaceModel.SpaceID, rentDefinitionIds: RentDefinitionModel.RentDefinitionID[] }) =>
                rentDefinitionApi.linkToSpace(spaceId, rentDefinitionIds),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useUnlinkRentsFromSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, rentDefinitionIds}: { spaceId: SpaceModel.SpaceID, rentDefinitionIds: RentDefinitionModel.RentDefinitionID[] }) =>
                rentDefinitionApi.unlinkFromSpace(spaceId, rentDefinitionIds),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }
}
