import {Backend, type RequestHelperInit} from "../../utils"
import type {Paged} from "@suiteonix/models"

import type {PropertyListingProfileModel} from "./model.ts"

class PropertyListingProfileApi {
    query(query?: PropertyListingProfileModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<PropertyListingProfileModel.PropertyListingProfile>>(
            "/listing-profile/properties",
            {
                ...init,
                query,
            },
        )
    }

    getById(listingProfileId: PropertyListingProfileModel.ListingProfileID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyListingProfileModel.PropertyListingProfile>(
            `/listing-profile/property/${listingProfileId}`,
            init,
        )
    }

    getDetailed(listingProfileId: PropertyListingProfileModel.ListingProfileID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyListingProfileModel.Detailed>(
            `/property-listing-profile/${listingProfileId}/detailed`,
            init,
        )
    }

    getListingIds(listingProfileId: PropertyListingProfileModel.ListingProfileID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyListingProfileModel.ListingID[]>(
            `/property-listing-profile/${listingProfileId}/listings`,
            init,
        )
    }
}

const propertyListingProfileApi = new PropertyListingProfileApi()

export default propertyListingProfileApi
