import type {LeaseDefinitionModel} from "@/modules/real-estate/lease-definition/model.ts";
import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import leaseDefinitionApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace LeaseDefinitionApiHook {
    export const useQueryPropertyLeases = (
        query: Parameters<typeof leaseDefinitionApi.listByProperty>[0],
    ) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: [...RealEstateQueryKeys.propertyLeases(query?.propertyId ?? ""), query],
                queryFn: () => leaseDefinitionApi.listByProperty(query, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetPropertyLease = (propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyLease(propertyId, leaseDefinitionId),
                queryFn: () => leaseDefinitionApi.getByProperty(propertyId, leaseDefinitionId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreatePropertyLease(successHandler?: SuccessHandler<LeaseDefinitionModel.LeaseDefinition>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: LeaseDefinitionModel.Create }) =>
                    leaseDefinitionApi.createForProperty(propertyId, body, {errHandler}),


                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLeases(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdatePropertyLease(successHandler?: SuccessHandler<LeaseDefinitionModel.LeaseDefinition>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, leaseDefinitionId, body}: { propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update }) =>
                    leaseDefinitionApi.updateForProperty(propertyId, leaseDefinitionId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLeases(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeletePropertyLease(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, leaseDefinitionId}: { propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID }) =>
                    leaseDefinitionApi.deleteForProperty(propertyId, leaseDefinitionId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLeases(variables.propertyId)}),
                    ])
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyLease(variables.propertyId, variables.leaseDefinitionId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export function useSetPropertyDefaultLease(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, leaseDefinitionId}: { propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID }) =>
                    leaseDefinitionApi.setPropertyDefault(propertyId, leaseDefinitionId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLeases(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useClearPropertyDefaultLease(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (propertyId: PropertyModel.PropertyID) => leaseDefinitionApi.clearPropertyDefault(propertyId, {errHandler}),
                onSuccess: async (data, propertyId) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyLeases(propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export const useQuerySpaceLeases = (spaceId: SpaceModel.SpaceID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spaceLeases(spaceId),
                queryFn: () => leaseDefinitionApi.listBySpace(spaceId, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetSpaceLease = (spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spaceLease(spaceId, leaseDefinitionId),
                queryFn: () => leaseDefinitionApi.getBySpace(spaceId, leaseDefinitionId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreateSpaceLease(successHandler?: SuccessHandler<LeaseDefinitionModel.LeaseDefinition>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, body}: { spaceId: SpaceModel.SpaceID, body: LeaseDefinitionModel.Create }) =>
                    leaseDefinitionApi.createForSpace(spaceId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateSpaceLease(successHandler?: SuccessHandler<LeaseDefinitionModel.LeaseDefinition>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, leaseDefinitionId, body}: { spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update }) =>
                    leaseDefinitionApi.updateForSpace(spaceId, leaseDefinitionId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteSpaceLease(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, leaseDefinitionId}: { spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID }) =>
                    leaseDefinitionApi.deleteForSpace(spaceId, leaseDefinitionId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.spaceLease(variables.spaceId, variables.leaseDefinitionId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export function useSetSpaceDefaultLease(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, leaseDefinitionId}: { spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID }) =>
                    leaseDefinitionApi.setSpaceDefault(spaceId, leaseDefinitionId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useClearSpaceDefaultLease(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (spaceId: SpaceModel.SpaceID) => leaseDefinitionApi.clearSpaceDefault(spaceId, {errHandler}),
                onSuccess: async (data, spaceId) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useLinkLeasesToSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, leaseDefinitionIds}: { spaceId: SpaceModel.SpaceID, leaseDefinitionIds: LeaseDefinitionModel.LeaseDefinitionID[] }) =>
                    leaseDefinitionApi.linkToSpace(spaceId, leaseDefinitionIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUnlinkLeasesFromSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, leaseDefinitionIds}: { spaceId: SpaceModel.SpaceID, leaseDefinitionIds: LeaseDefinitionModel.LeaseDefinitionID[] }) =>
                    leaseDefinitionApi.unlinkFromSpace(spaceId, leaseDefinitionIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }
}
