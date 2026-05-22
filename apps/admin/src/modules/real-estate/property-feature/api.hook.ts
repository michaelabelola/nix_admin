import type {PropertyFeatureModel} from "#/modules/real-estate/property-feature/model.ts";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "#/modules/real-estate/query-keys.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import propertyFeatureApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace PropertyFeatureApiHook {
    export const useQueryPropertyFeatures = (
        query: Parameters<typeof propertyFeatureApi.queryByProperty>[0],
    ) => {
        const errHandler = useResponseFieldErrorHandler()
        const propertyId = query?.propertyId ?? ""
        return {
            ...useQuery({
                queryKey: [...RealEstateQueryKeys.propertyFeatures(propertyId), query],
                queryFn: () => propertyFeatureApi.queryByProperty({
                    ...query,
                    propertyId,
                }, {errHandler}),
                enabled: Boolean(propertyId),
            }),
            errHandler,
        }
    }

    export const useGetPropertyFeature = (propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.propertyFeature(propertyId, featureId),
                queryFn: () => propertyFeatureApi.getByProperty(propertyId, featureId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useLinkFeaturesToProperty(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, featureIds}: {
                    propertyId: PropertyModel.PropertyID,
                    featureIds: PropertyFeatureModel.PropertyFeatureID[]
                }) =>
                    propertyFeatureApi.linkToProperty(propertyId, featureIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUnlinkFeaturesFromProperty(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, featureIds}: {
                    propertyId: PropertyModel.PropertyID,
                    featureIds: PropertyFeatureModel.PropertyFeatureID[]
                }) =>
                    propertyFeatureApi.unlinkFromProperty(propertyId, featureIds, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useCreatePropertyFeature(successHandler?: SuccessHandler<PropertyFeatureModel.PropertyFeature>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, body}: {
                    propertyId: PropertyModel.PropertyID,
                    body: PropertyFeatureModel.Create
                }) =>
                    propertyFeatureApi.createForProperty(propertyId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyFeatures(variables.propertyId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdatePropertyFeature(successHandler?: SuccessHandler<PropertyFeatureModel.PropertyFeature>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, featureId, body}: {
                    propertyId: PropertyModel.PropertyID,
                    featureId: PropertyFeatureModel.PropertyFeatureID,
                    body: PropertyFeatureModel.Update
                }) =>
                    propertyFeatureApi.updateForProperty(propertyId, featureId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyFeatures(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyFeature(variables.propertyId, variables.featureId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeletePropertyFeature(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({propertyId, featureId}: {
                    propertyId: PropertyModel.PropertyID,
                    featureId: PropertyFeatureModel.PropertyFeatureID
                }) =>
                    propertyFeatureApi.deleteForProperty(propertyId, featureId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.propertyFeatures(variables.propertyId)}),
                    ])
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyFeature(variables.propertyId, variables.featureId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}
