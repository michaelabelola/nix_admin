import type {PropertyFeatureRuleModel} from "./model.ts";
import {RealEstateQueryKeys} from "../query-keys.ts";
import {useResponseFieldErrorHandler} from "../../utils";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import propertyFeatureRuleApi from "./api.ts";

type SuccessHandler<T> = (data: T) => void

export namespace PropertyFeatureRuleRequest {
    export const useQueryFeatureRules = (params?: PropertyFeatureRuleModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.featureRules(params),
                queryFn: () => propertyFeatureRuleApi.query(params, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetFeatureRule = (featureRuleId: PropertyFeatureRuleModel.FeatureRuleID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: RealEstateQueryKeys.featureRule(featureRuleId),
                queryFn: () => propertyFeatureRuleApi.getById(featureRuleId, {errHandler}),
            }),
            errHandler,
        }
    }

    export function useCreateFeatureRule(successHandler?: SuccessHandler<PropertyFeatureRuleModel.PropertyFeatureRule>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: PropertyFeatureRuleModel.Create) => propertyFeatureRuleApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.featureRulesRoot})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateFeatureRule(successHandler?: SuccessHandler<PropertyFeatureRuleModel.PropertyFeatureRule>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({featureRuleId, body}: { featureRuleId: PropertyFeatureRuleModel.FeatureRuleID, body: PropertyFeatureRuleModel.Update }) =>
                    propertyFeatureRuleApi.update(featureRuleId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.featureRulesRoot}),
                        queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.featureRule(variables.featureRuleId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteFeatureRule(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (featureRuleId: PropertyFeatureRuleModel.FeatureRuleID) => propertyFeatureRuleApi.delete(featureRuleId, {errHandler}),
                onSuccess: async (_data, featureRuleId) => {
                    await queryClient.invalidateQueries({queryKey: RealEstateQueryKeys.featureRulesRoot})
                    await queryClient.removeQueries({queryKey: RealEstateQueryKeys.featureRule(featureRuleId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}
