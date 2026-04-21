import type {PropertyFeatureModel} from "@/modules/real-estate/property-feature/model.ts";
import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import propertyFeatureApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace PropertyFeatureApiHook {
    export const useQueryPropertyFeatures = (propertyId: PropertyModel.PropertyID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyFeatures(propertyId),
            queryFn: () => propertyFeatureApi.listByProperty(propertyId),
        })

    export const useGetPropertyFeature = (propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.propertyFeature(propertyId, featureId),
            queryFn: () => propertyFeatureApi.getByProperty(propertyId, featureId),
        })

    export function useLinkFeaturesToProperty(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, featureIds}: { propertyId: PropertyModel.PropertyID, featureIds: PropertyFeatureModel.PropertyFeatureID[] }) =>
                propertyFeatureApi.linkToProperty(propertyId, featureIds),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useUnlinkFeaturesFromProperty(successHandler?: SuccessHandler<PropertyModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, featureIds}: { propertyId: PropertyModel.PropertyID, featureIds: PropertyFeatureModel.PropertyFeatureID[] }) =>
                propertyFeatureApi.unlinkFromProperty(propertyId, featureIds),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useLinkFeaturesToSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, featureIds, propertyId}: { spaceId: SpaceModel.SpaceID, featureIds: PropertyFeatureModel.PropertyFeatureID[], propertyId?: PropertyModel.PropertyID }) =>
                propertyFeatureApi.linkToSpace(spaceId, featureIds, propertyId),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                    variables.propertyId
                        ? queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                        : Promise.resolve(),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useUnlinkFeaturesFromSpace(successHandler?: SuccessHandler<SpaceModel.Detailed>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({spaceId, featureIds, propertyId}: { spaceId: SpaceModel.SpaceID, featureIds: PropertyFeatureModel.PropertyFeatureID[], propertyId?: PropertyModel.PropertyID }) =>
                propertyFeatureApi.unlinkFromSpace(spaceId, featureIds, propertyId),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.space(variables.spaceId)}),
                    variables.propertyId
                        ? queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                        : Promise.resolve(),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useCreatePropertyFeature(successHandler?: SuccessHandler<PropertyFeatureModel.PropertyFeature>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, body}: { propertyId: PropertyModel.PropertyID, body: PropertyFeatureModel.Create }) =>
                propertyFeatureApi.createForProperty(propertyId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useUpdatePropertyFeature(successHandler?: SuccessHandler<PropertyFeatureModel.PropertyFeature>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, featureId, body}: { propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID, body: PropertyFeatureModel.Update }) =>
                propertyFeatureApi.updateForProperty(propertyId, featureId, body),
            onSuccess: async (data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                successHandler?.(data)
            },
        })
    }

    export function useDeletePropertyFeature(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({propertyId, featureId}: { propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID }) =>
                propertyFeatureApi.deleteForProperty(propertyId, featureId),
            onSuccess: async (_data, variables) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.property(variables.propertyId)})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.propertyFeature(variables.propertyId, variables.featureId)})
                successHandler?.()
            },
        })
    }
}
