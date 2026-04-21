import type {LeaseDefinitionModel} from "@/modules/real-estate/lease-definition/model.ts";
import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import leaseDefinitionApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace LeaseDefinitionApiHook {
    export const useQueryPropertyLeases = (propertyId: PropertyModel.PropertyID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyLeases(propertyId),
            queryFn: () => leaseDefinitionApi.listByProperty(propertyId),
        })

    export const useGetPropertyLease = (propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyLease(propertyId, leaseDefinitionId),
            queryFn: () => leaseDefinitionApi.getByProperty(propertyId, leaseDefinitionId),
        })

    export function useCreatePropertyLease(successHandler?: SuccessHandler<LeaseDefinitionModel.LeaseDefinition>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: LeaseDefinitionModel.Create }) =>
                leaseDefinitionApi.createForProperty(propertyId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useUpdatePropertyLease(successHandler?: SuccessHandler<LeaseDefinitionModel.LeaseDefinition>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, leaseDefinitionId, body}: { propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update }) =>
                leaseDefinitionApi.updateForProperty(propertyId, leaseDefinitionId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useDeletePropertyLease(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, leaseDefinitionId}: { propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID }) =>
                leaseDefinitionApi.deleteForProperty(propertyId, leaseDefinitionId),
            onSuccess: async (_data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyLease(variables.propertyId, variables.leaseDefinitionId)})
                successHandler?.()
            },
        })
    }

    export function useSetPropertyDefaultLease(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, leaseDefinitionId}: { propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID }) =>
                leaseDefinitionApi.setPropertyDefault(propertyId, leaseDefinitionId),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useClearPropertyDefaultLease(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (propertyId: PropertyModel.PropertyID) => leaseDefinitionApi.clearPropertyDefault(propertyId),
            onSuccess: async (data, propertyId) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)})
                successHandler?.(data)
            },
        })
    }

    export const useQuerySpaceLeases = (spaceId: SpaceModel.SpaceID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.spaceLeases(spaceId),
            queryFn: () => leaseDefinitionApi.listBySpace(spaceId),
        })

    export const useGetSpaceLease = (spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.spaceLease(spaceId, leaseDefinitionId),
            queryFn: () => leaseDefinitionApi.getBySpace(spaceId, leaseDefinitionId),
        })

    export function useCreateSpaceLease(successHandler?: SuccessHandler<LeaseDefinitionModel.LeaseDefinition>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, body}: { spaceId: SpaceModel.SpaceID, body: LeaseDefinitionModel.Create }) =>
                leaseDefinitionApi.createForSpace(spaceId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useUpdateSpaceLease(successHandler?: SuccessHandler<LeaseDefinitionModel.LeaseDefinition>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, leaseDefinitionId, body}: { spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update }) =>
                leaseDefinitionApi.updateForSpace(spaceId, leaseDefinitionId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useDeleteSpaceLease(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, leaseDefinitionId}: { spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID }) =>
                leaseDefinitionApi.deleteForSpace(spaceId, leaseDefinitionId),
            onSuccess: async (_data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.spaceLease(variables.spaceId, variables.leaseDefinitionId)})
                successHandler?.()
            },
        })
    }

    export function useSetSpaceDefaultLease(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, leaseDefinitionId}: { spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID }) =>
                leaseDefinitionApi.setSpaceDefault(spaceId, leaseDefinitionId),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useClearSpaceDefaultLease(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (spaceId: SpaceModel.SpaceID) => leaseDefinitionApi.clearSpaceDefault(spaceId),
            onSuccess: async (data, spaceId) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useLinkLeasesToSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, leaseDefinitionIds}: { spaceId: SpaceModel.SpaceID, leaseDefinitionIds: LeaseDefinitionModel.LeaseDefinitionID[] }) =>
                leaseDefinitionApi.linkToSpace(spaceId, leaseDefinitionIds),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }

    export function useUnlinkLeasesFromSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, leaseDefinitionIds}: { spaceId: SpaceModel.SpaceID, leaseDefinitionIds: LeaseDefinitionModel.LeaseDefinitionID[] }) =>
                leaseDefinitionApi.unlinkFromSpace(spaceId, leaseDefinitionIds),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                successHandler?.(data)
            },
        })
    }
}
