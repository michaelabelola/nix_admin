import type {PropertyModel} from "@/modules/real-estate/property/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {PageRequest, Paged} from "#/models/PagedModel.ts"

class PropertyApi {
    query(params?: PageRequest, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<PropertyModel.Property>>("/real-estate/properties", {query: params, ...init})
    }

    getById(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/properties/${propertyId}`, init)
    }

    getDetailed(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/properties/${propertyId}/detailed`, init)
    }

    create(body: PropertyModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>("/real-estate/properties", {
            method: "POST",
            body,
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

    uploadAvatar(propertyId: PropertyModel.PropertyID, file: File, part: "image" | "avatar" = "image", init?: Partial<RequestHelperInit>) {
        const formData = new FormData()
        formData.append(part, file)
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/property/${propertyId}/${part}`, {
            method: "POST",
            body: formData,
            contentType: "omit",
            ...init,
        })
    }

    initializeFilesStorage(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/property/${propertyId}/files-storage/initialize`, {
            method: "POST",
            ...init,
        })
    }

    addTags(propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/property/${propertyId}/tags`, {
            method: "POST",
            body: tagIds,
            ...init,
        })
    }

    removeTags(propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/property/${propertyId}/tags`, {
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
