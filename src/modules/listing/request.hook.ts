import {useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query"

import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx"
import {Page_EMPTY} from "#/models/PagedModel.ts"

import listingApi from "./api.ts"
import type {ListingModel} from "./model.ts"

type SuccessHandler<T> = (data: T) => void
type AddItemToListingVariables = {
    listingId: ListingModel.ListingID
    listingProfileId: ListingModel.ListingProfileID
}

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

    export const useGetListingsByIds = (listingIds: ListingModel.ListingID[]) => {
        const errHandler = useResponseFieldErrorHandler()
        const queries = useQueries({
            queries: listingIds.map((listingId) => ({
                queryKey: ListingQueryKeys.detail(listingId),
                queryFn: () => listingApi.getById(listingId, {errHandler}),
                enabled: Boolean(listingId),
            })),
        })

        return {
            queries,
            data: queries.map((query) => query.data).filter(Boolean) as ListingModel.Detailed[],
            isLoading: queries.some((query) => query.isLoading),
            isFetching: queries.some((query) => query.isFetching),
            isError: queries.some((query) => query.isError),
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

    export function useAddItemToListing(successHandler?: SuccessHandler<{ id: ListingModel.ListingProfileID }>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({listingId, listingProfileId}: AddItemToListingVariables) =>
                    listingApi.addItemToListing(listingId, listingProfileId, {errHandler}),
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
}
