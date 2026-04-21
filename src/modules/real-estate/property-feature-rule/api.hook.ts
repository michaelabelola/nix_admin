import type {PropertyFeatureRuleModel} from "@/modules/real-estate/property-feature-rule/model.ts";
import {RealEstateQueryKeys} from "@/modules/real-estate/query-keys.ts";
import type {PageRequest} from "@/models/PagedModel.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import propertyFeatureRuleApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace PropertyFeatureRuleApiHook {
    export const useQueryFeatureRules = (params?: PageRequest) =>
        useQuery({
            queryKey: RealEstateQueryKeys.featureRules(params),
            queryFn: () => propertyFeatureRuleApi.query(params),
        })

    export const useGetFeatureRule = (featureRuleId: PropertyFeatureRuleModel.FeatureRuleID) =>
        useQuery({
            queryKey: RealEstateQueryKeys.featureRule(featureRuleId),
            queryFn: () => propertyFeatureRuleApi.getById(featureRuleId),
        })

    export function useCreateFeatureRule(successHandler?: SuccessHandler<PropertyFeatureRuleModel.PropertyFeatureRule>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (body: PropertyFeatureRuleModel.Create) => propertyFeatureRuleApi.create(body),
            onSuccess: async (data) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.featureRulesRoot})
                successHandler?.(data)
            },
        })
    }

    export function useUpdateFeatureRule(successHandler?: SuccessHandler<PropertyFeatureRuleModel.PropertyFeatureRule>) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: ({featureRuleId, body}: { featureRuleId: PropertyFeatureRuleModel.FeatureRuleID, body: PropertyFeatureRuleModel.Update }) =>
                propertyFeatureRuleApi.update(featureRuleId, body),
            onSuccess: async (data, variables) => {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.featureRulesRoot}),
                    queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.featureRule(variables.featureRuleId)}),
                ])
                successHandler?.(data)
            },
        })
    }

    export function useDeleteFeatureRule(successHandler?: () => void) {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (featureRuleId: PropertyFeatureRuleModel.FeatureRuleID) => propertyFeatureRuleApi.delete(featureRuleId),
            onSuccess: async (_data, featureRuleId) => {
                await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.featureRulesRoot})
                await queryClient.removeQueries({queryKey: RealEstateQueryKeys.featureRule(featureRuleId)})
                successHandler?.()
            },
        })
    }
}
