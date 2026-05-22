import type {PropertyModel} from "../property/model.ts";
import type {RealEstatePricingModel} from "./model.ts";
import {RealEstateQueryKeys} from "../query-keys.ts";
import {useResponseFieldErrorHandler} from "../../utils";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import pricingApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace PricingApiHook {
    export const useQueryPropertyPricings = (
        query: Parameters<typeof pricingApi.listByProperty>[0],
    ) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: [...RealEstateQueryKeys.propertyPricings(query?.propertyId ?? ""), query],
                queryFn: () => pricingApi.listByProperty(query, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetPropertyPricing = (propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyPricing(propertyId, pricingId),
                queryFn: () => pricingApi.getByProperty(propertyId, pricingId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreatePropertyPricing(successHandler?: SuccessHandler<RealEstatePricingModel.RealEstatePricing>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: RealEstatePricingModel.Create }) =>
                    pricingApi.createForProperty(propertyId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyPricings(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdatePropertyPricing(successHandler?: SuccessHandler<RealEstatePricingModel.RealEstatePricing>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, pricingId, body}: {
                    propertyId: PropertyModel.PropertyID,
                    pricingId: RealEstatePricingModel.PriceID,
                    body: RealEstatePricingModel.Update
                }) => pricingApi.updateForProperty(propertyId, pricingId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyPricings(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeletePropertyPricing(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, pricingId}: {
                    propertyId: PropertyModel.PropertyID,
                    pricingId: RealEstatePricingModel.PriceID
                }) => pricingApi.deleteForProperty(propertyId, pricingId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyPricings(variables.propertyId)}),
                    ])
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyPricing(variables.propertyId, variables.pricingId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export function useSetPropertyDefaultPricing(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, pricingId}: {
                    propertyId: PropertyModel.PropertyID,
                    pricingId: RealEstatePricingModel.PriceID
                }) => pricingApi.setPropertyDefault(propertyId, pricingId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyPricings(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useClearPropertyDefaultPricing(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (propertyId: PropertyModel.PropertyID) => pricingApi.clearPropertyDefault(propertyId, {errHandler}),
                onSuccess: async (data, propertyId) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyPricings(propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }
}
