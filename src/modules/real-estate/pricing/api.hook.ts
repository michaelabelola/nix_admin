import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import type {RealEstatePricingModel} from "@/modules/real-estate/pricing/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
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

    export const useQuerySpacePricings = (spaceId: SpaceModel.SpaceID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spacePricings(spaceId),
                queryFn: () => pricingApi.listBySpace(spaceId, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetSpacePricing = (spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.spacePricing(spaceId, pricingId),
                queryFn: () => pricingApi.getBySpace(spaceId, pricingId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreateSpacePricing(successHandler?: SuccessHandler<RealEstatePricingModel.RealEstatePricing>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, body}: { spaceId: SpaceModel.SpaceID, body: RealEstatePricingModel.Create }) =>
                    pricingApi.createForSpace(spaceId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateSpacePricing(successHandler?: SuccessHandler<RealEstatePricingModel.RealEstatePricing>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, pricingId, body}: {
                    spaceId: SpaceModel.SpaceID,
                    pricingId: RealEstatePricingModel.PriceID,
                    body: RealEstatePricingModel.Update
                }) => pricingApi.updateForSpace(spaceId, pricingId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteSpacePricing(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, pricingId}: {
                    spaceId: SpaceModel.SpaceID,
                    pricingId: RealEstatePricingModel.PriceID
                }) => pricingApi.deleteForSpace(spaceId, pricingId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.spacePricing(variables.spaceId, variables.pricingId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export function useSetSpaceDefaultPricing(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, pricingId}: {
                    spaceId: SpaceModel.SpaceID,
                    pricingId: RealEstatePricingModel.PriceID
                }) => pricingApi.setSpaceDefault(spaceId, pricingId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useClearSpaceDefaultPricing(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (spaceId: SpaceModel.SpaceID) => pricingApi.clearSpaceDefault(spaceId, {errHandler}),
                onSuccess: async (data, spaceId) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useLinkPricingsToSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, pricingIds}: {
                    spaceId: SpaceModel.SpaceID,
                    pricingIds: RealEstatePricingModel.PriceID[]
                }) => pricingApi.linkToSpace(spaceId, pricingIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUnlinkPricingsFromSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({spaceId, pricingIds}: {
                    spaceId: SpaceModel.SpaceID,
                    pricingIds: RealEstatePricingModel.PriceID[]
                }) => pricingApi.unlinkFromSpace(spaceId, pricingIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }
}
