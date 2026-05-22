import {useMemo} from "react"
import {useInfiniteQuery, useQuery} from "@tanstack/react-query"

import {useResponseFieldErrorHandler} from "../utils"

import listingQuerierApi from "./listing-querier.api.ts"
import type {ListingQuerierModel} from "./listing-querier.model.ts"
import type {ListingModel} from "./model.ts"
import {type PageSlice, PageSlice_EMPTY} from "@suiteonix/models";

export const ListingQuerierQueryKeys = {
    root: ["listing-querier"] as const,
    listingProperties: (listingId?: ListingModel.ListingID, query?: ListingQuerierModel.Request) =>
        [...ListingQuerierQueryKeys.root, "listing-properties", listingId, query] as const,
    infiniteListingProperties: (listingId?: ListingModel.ListingID, query?: ListingQuerierModel.Request) =>
        [...ListingQuerierQueryKeys.root, "listing-properties", "infinite", listingId, query] as const,
}

export namespace ListingQuerierRequest {
    export const useQueryListingProperties = (
        listingId?: ListingModel.ListingID,
        query?: ListingQuerierModel.Request,
    ) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ListingQuerierQueryKeys.listingProperties(listingId, query),
                queryFn: () => listingQuerierApi.queryListingProperties(listingId!, query, {errHandler}),
                enabled: Boolean(listingId),
                initialData: PageSlice_EMPTY,
            }),
            errHandler,
        }
    }

    export const useInfiniteQueryListingProperties = (
        listingId?: ListingModel.ListingID,
        query?: ListingQuerierModel.Request,
    ) => {
        const errHandler = useResponseFieldErrorHandler()
        const infiniteQuery = useInfiniteQuery({
            queryKey: ListingQuerierQueryKeys.infiniteListingProperties(listingId, query),
            queryFn: ({pageParam}) => listingQuerierApi.queryListingProperties(listingId!, {
                ...query,
                page: pageParam,
            }, {errHandler}),
            enabled: Boolean(listingId),
            initialPageParam: query?.page ?? 0,
            getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextPage : undefined,
        })
        const data = useMemo<PageSlice<ListingQuerierModel.Response>>(() => {
            const pages = infiniteQuery.data?.pages ?? []
            const lastPage = pages.at(-1)

            if (!lastPage) return PageSlice_EMPTY

            return {
                content: pages.flatMap((page) => page.content),
                numberOfElements: pages.reduce((total, page) => total + page.numberOfElements, 0),
                size: lastPage.size,
                number: lastPage.number,
                hasNext: lastPage.hasNext,
                nextPage: lastPage.nextPage,
            }
        }, [infiniteQuery.data?.pages])

        return {
            ...infiniteQuery,
            data,
            errHandler,
        }
    }
}
