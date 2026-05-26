import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import {useResponseFieldErrorHandler} from "../utils"
import {Page_EMPTY} from "@suiteonix/models"
import customerApi from "./api.ts"
import type {CustomerModel} from "./model.ts"
import {CustomerQueryKeys} from "./query-keys.ts"
import type {TagModel} from "../tags/model.ts"

type SuccessHandler<T> = (data: T) => void

export namespace CustomerRequest {
    export const useQueryCustomers = (query?: CustomerModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: CustomerQueryKeys.list(query),
                queryFn: () => customerApi.query(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useGetCustomer = (customerId?: CustomerModel.CustomerID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: CustomerQueryKeys.record(customerId || ""),
                queryFn: () => customerApi.getById(customerId!, {errHandler}),
                enabled: !!customerId,
            }),
            errHandler,
        }
    }

    export const useGetCustomerDetailed = (customerId?: CustomerModel.CustomerID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: CustomerQueryKeys.detailed(customerId || ""),
                queryFn: () => customerApi.getDetailed(customerId!, {errHandler}),
                enabled: !!customerId,
            }),
            errHandler,
        }
    }

    export const useGetCustomerTags = (customerId?: CustomerModel.CustomerID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: CustomerQueryKeys.tags(customerId || ""),
                queryFn: () => customerApi.getTags(customerId!, {errHandler}),
                enabled: !!customerId,
                initialData: [] as TagModel.Tag[],
            }),
            errHandler,
        }
    }

    export function useCreateCustomer(successHandler?: SuccessHandler<CustomerModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: CustomerModel.Create) => customerApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: CustomerQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useCreateCustomerSelfAccount(successHandler?: SuccessHandler<CustomerModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: CustomerModel.SelfCreateRequest) => customerApi.createSelfAccount(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: CustomerQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateCustomer(successHandler?: SuccessHandler<CustomerModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({customerId, body}: { customerId: CustomerModel.CustomerID; body: CustomerModel.Update }) =>
                    customerApi.update(customerId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.record(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.detailed(variables.customerId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateCustomerContact(successHandler?: SuccessHandler<CustomerModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({customerId, body}: { customerId: CustomerModel.CustomerID; body: CustomerModel.Contact }) =>
                    customerApi.updateContact(customerId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.record(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.detailed(variables.customerId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateCustomerBillingAddress(successHandler?: SuccessHandler<CustomerModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({customerId, body}: { customerId: CustomerModel.CustomerID; body: CustomerModel.Address }) =>
                    customerApi.updateBillingAddress(customerId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.record(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.detailed(variables.customerId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateCustomerShippingAddress(successHandler?: SuccessHandler<CustomerModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({customerId, body}: { customerId: CustomerModel.CustomerID; body: CustomerModel.Address }) =>
                    customerApi.updateShippingAddress(customerId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.record(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.detailed(variables.customerId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateCustomerPreferences(successHandler?: SuccessHandler<CustomerModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({customerId, body}: { customerId: CustomerModel.CustomerID; body: CustomerModel.Preferences }) =>
                    customerApi.updatePreferences(customerId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.record(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.detailed(variables.customerId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useInitializeCustomerFilesStorage(successHandler?: SuccessHandler<CustomerModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (customerId: CustomerModel.CustomerID) =>
                    customerApi.initializeFilesStorage(customerId, {errHandler}),
                onSuccess: async (data, customerId) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.record(customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.detailed(customerId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteCustomer(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (customerId: CustomerModel.CustomerID) => customerApi.delete(customerId, {errHandler}),
                onSuccess: async (_data, customerId) => {
                    await queryClient.invalidateQueries({queryKey: CustomerQueryKeys.root})
                    await Promise.all([
                        queryClient.removeQueries({queryKey: CustomerQueryKeys.record(customerId)}),
                        queryClient.removeQueries({queryKey: CustomerQueryKeys.detailed(customerId)}),
                        queryClient.removeQueries({queryKey: CustomerQueryKeys.tags(customerId)}),
                    ])
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export function useAddCustomerTag(successHandler?: SuccessHandler<TagModel.Tag>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({customerId, tagId}: { customerId: CustomerModel.CustomerID; tagId: TagModel.TagID }) =>
                    customerApi.addTag(customerId, tagId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.tags(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.record(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.detailed(variables.customerId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useRemoveCustomerTag(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({customerId, tagId}: { customerId: CustomerModel.CustomerID; tagId: TagModel.TagID }) =>
                    customerApi.removeTag(customerId, tagId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.tags(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.record(variables.customerId)}),
                        queryClient.invalidateQueries({queryKey: CustomerQueryKeys.detailed(variables.customerId)}),
                    ])
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}
