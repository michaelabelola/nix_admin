import type {LeaseDefinitionModel} from "./model.ts";
import type {PropertyModel} from "../property/model.ts";
import {RealEstateQueryKeys} from "../query-keys.ts";
import {useResponseFieldErrorHandler} from "../../utils";
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
}
