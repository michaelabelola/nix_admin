import {useQuery} from "@tanstack/react-query"

import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx"

import listingQuerierApi from "./listing-querier.api.ts"
import {ListingQuerierModel} from "./listing-querier.model.ts"
import type {ListingModel} from "./model.ts"

export const ListingQuerierQueryKeys = {
    root: ["listing-querier"] as const,
    listingProperties: (listingId?: ListingModel.ListingID, query?: ListingQuerierModel.Request) =>
        [...ListingQuerierQueryKeys.root, "listing-properties", listingId, query] as const,
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
                initialData: ListingQuerierModel.PageSlice_EMPTY,
            }),
            errHandler,
        }
    }
}
