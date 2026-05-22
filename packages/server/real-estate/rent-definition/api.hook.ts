import type {PropertyModel} from "../property/model.ts";
import {RealEstateQueryKeys} from "../query-keys.ts";
import type {RentDefinitionModel} from "./model.ts";
import {useResponseFieldErrorHandler} from "../../utils";
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
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyRents(variables.propertyId)}),
                    ])
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
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyRents(variables.propertyId)}),
                    ])
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
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyRents(variables.propertyId)}),
                    ])
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
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyRents(variables.propertyId)}),
                    ])
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
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyRents(propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }
}
