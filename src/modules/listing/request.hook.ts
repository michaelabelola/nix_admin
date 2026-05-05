import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx"
import {Page_EMPTY} from "#/models/PagedModel.ts"

import listingApi from "./api.ts"
import type {ListingModel} from "./model.ts"

type SuccessHandler<T> = (data: T) => void

export const ListingQueryKeys = {
    root: ["listings"] as const,
    query: (query?: ListingModel.Query) => [...ListingQueryKeys.root, "query", query] as const,
    detail: (listingId: ListingModel.ListingID) => [...ListingQueryKeys.root, listingId] as const,
}

export namespace ListingRequest {
    export const useQueryListings = (query?: ListingModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ListingQueryKeys.query(query),
                queryFn: () => listingApi.query(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useGetListing = (listingId?: ListingModel.ListingID) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ListingQueryKeys.detail(listingId || ""),
                queryFn: () => listingApi.getById(listingId!, {errHandler}),
                enabled: Boolean(listingId),
            }),
            errHandler,
        }
    }

    export function useCreateListing(successHandler?: SuccessHandler<ListingModel.Listing>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: ListingModel.Create) => listingApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: ListingQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateListing(successHandler?: SuccessHandler<ListingModel.Listing>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({listingId, body}: { listingId: ListingModel.ListingID; body: ListingModel.Update }) =>
                    listingApi.update(listingId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: ListingQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: ListingQueryKeys.detail(variables.listingId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteListing(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (listingId: ListingModel.ListingID) => listingApi.delete(listingId, {errHandler}),
                onSuccess: async (_data, listingId) => {
                    await queryClient.invalidateQueries({queryKey: ListingQueryKeys.root})
                    await queryClient.removeQueries({queryKey: ListingQueryKeys.detail(listingId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}
