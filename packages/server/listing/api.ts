import {Backend, type RequestHelperInit} from "../utils"
import type {ResponseDto} from "@suiteonix/models"
import type {Paged} from "@suiteonix/models"

import type {ListingModel} from "./model.ts"

class ListingApi {
    query(params?: ListingModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<ListingModel.Listing>>("/listings", {
            query: params,
            ...init,
        })
    }

    getById(listingId: ListingModel.ListingID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ListingModel.Detailed>(`/listing/${listingId}`, init)
    }

    create(body: ListingModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ListingModel.Listing>("/listing", {
            method: "POST",
            body,
            ...init,
        })
    }

    update(listingId: ListingModel.ListingID, body: ListingModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ListingModel.Listing>(`/listing/${listingId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    delete(listingId: ListingModel.ListingID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/listing/${listingId}`, {
            method: "DELETE",
            ...init,
        })
    }

    addItemToListing(
        listingId: ListingModel.ListingID,
        listingProfileId: ListingModel.ListingProfileID,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<{ id: ListingModel.ListingProfileID }>(`/listing/${listingId}/items/${listingProfileId}`, {
            method: "POST",
            ...init,
        })
    }
}

const listingApi = new ListingApi()

export default listingApi
