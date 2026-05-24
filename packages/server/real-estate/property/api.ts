import type {PropertyModel} from "./model.ts"
import type {PropertyListingProfileModel} from "../property-listing-profile/model.ts"
import {Backend, type RequestHelperInit} from "../../utils"
import type {ResponseDto} from "@suiteonix/models"
import type {PageRequest, Paged} from "@suiteonix/models"

class PropertyApi {
    query(params?: PageRequest, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<PropertyModel.Property>>("/real-estate/properties", {query: params, ...init})
    }

    getById(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/properties/${propertyId}`, init)
    }

    getDetailed(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/properties/${propertyId}/detailed`, init)
    }

    create(body: PropertyModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>("/real-estate/properties", {
            method: "POST",
            body,
            ...init,
        })
    }

    finishOnboarding(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/properties/${propertyId}/onboarding/finish`, {
            method: "POST",
            ...init,
        })
    }

    update(propertyId: PropertyModel.PropertyID, body: PropertyModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/properties/${propertyId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    createListingProfile(propertyId: PropertyModel.PropertyID, body: PropertyModel.CreateListingProfile, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyListingProfileModel.PropertyListingProfile>(`/real-estate/properties/${propertyId}/listing-profiles`, {
            method: "POST",
            body,
            ...init,
        })
    }

    uploadAvatar(propertyId: PropertyModel.PropertyID, file: File, init?: Partial<RequestHelperInit>) {
        const formData = new FormData()
        formData.append("avatar", file)
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/properties/${propertyId}/avatar`, {
            method: "POST",
            body: formData,
            contentType: "omit",
            ...init,
        })
    }

    initializeFilesStorage(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/properties/${propertyId}/files-storage/initialize`, {
            method: "POST",
            ...init,
        })
    }

    addTags(propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/properties/${propertyId}/tags`, {
            method: "POST",
            body: tagIds,
            ...init,
        })
    }

    removeTags(propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/properties/${propertyId}/tags`, {
            method: "DELETE",
            body: tagIds,
            ...init,
        })
    }

    delete(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}`, {
            method: "DELETE",
            ...init,
        })
    }

    queryLocations(params?: PageRequest, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<PropertyModel.PropertyLocation>>("/real-estate/locations", {query: params, ...init})
    }

    getPropertyLocation(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.PropertyLocationDetailed>(`/real-estate/properties/${propertyId}/location`, init)
    }

    addLocationToProperty(propertyId: PropertyModel.PropertyID, body: PropertyModel.PropertyLocationCreate, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.PropertyLocationDetailed>(`/real-estate/properties/${propertyId}/location`, {
            method: "POST",
            body,
            ...init,
        })
    }

    getLocation(locationId: PropertyModel.PropertyLocationID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.PropertyLocationDetailed>(`/real-estate/locations/${locationId}`, init)
    }

    createLocation(body: PropertyModel.PropertyLocationCreate, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.PropertyLocation>("/real-estate/locations", {
            method: "POST",
            body,
            ...init,
        })
    }

    updateLocation(locationId: PropertyModel.PropertyLocationID, body: PropertyModel.PropertyLocationUpdate, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.PropertyLocation>(`/real-estate/locations/${locationId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteLocation(locationId: PropertyModel.PropertyLocationID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/locations/${locationId}`, {
            method: "DELETE",
            ...init,
        })
    }
}

const propertyApi = new PropertyApi()
export default propertyApi
