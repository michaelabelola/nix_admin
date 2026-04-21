import type { PropertyModel } from "@/modules/real-estate/property/model.ts"
import {Backend} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {PageRequest, Paged} from "#/models/PagedModel.ts"

class PropertyApi {
    query(params?: PageRequest) {
        return Backend.authRequest<Paged<PropertyModel.Property>>("/real-estate/properties", {query: params})
    }

    getById(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/properties/${propertyId}`)
    }

    getDetailed(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/properties/${propertyId}/detailed`)
    }

    create(body: PropertyModel.Create) {
        return Backend.authRequest<PropertyModel.Property>("/real-estate/properties", {
            method: "POST",
            body,
        })
    }

    update(propertyId: PropertyModel.PropertyID, body: PropertyModel.Update) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/properties/${propertyId}`, {
            method: "PATCH",
            body,
        })
    }

    uploadAvatar(propertyId: PropertyModel.PropertyID, file: File, part: "image" | "avatar" = "image") {
        const formData = new FormData()
        formData.append(part, file)
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/property/${propertyId}/${part}`, {
            method: "POST",
            body: formData,
            contentType: "omit",
        })
    }

    initializeFilesStorage(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/property/${propertyId}/files-storage/initialize`, {
            method: "POST",
        })
    }

    addTags(propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[]) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/property/${propertyId}/tags`, {
            method: "POST",
            body: tagIds,
        })
    }

    removeTags(propertyId: PropertyModel.PropertyID, tagIds: PropertyModel.TagID[]) {
        return Backend.authRequest<PropertyModel.Property>(`/real-estate/property/${propertyId}/tags`, {
            method: "DELETE",
            body: tagIds,
        })
    }

    delete(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}`, {
            method: "DELETE",
        })
    }

    queryLocations(params?: PageRequest) {
        return Backend.authRequest<Paged<PropertyModel.PropertyLocation>>("/real-estate/locations", {query: params})
    }

    getLocation(locationId: PropertyModel.PropertyLocationID) {
        return Backend.authRequest<PropertyModel.PropertyLocationDetailed>(`/real-estate/locations/${locationId}`)
    }

    createLocation(body: PropertyModel.PropertyLocationCreate) {
        return Backend.authRequest<PropertyModel.PropertyLocation>("/real-estate/locations", {
            method: "POST",
            body,
        })
    }

    updateLocation(locationId: PropertyModel.PropertyLocationID, body: PropertyModel.PropertyLocationUpdate) {
        return Backend.authRequest<PropertyModel.PropertyLocation>(`/real-estate/locations/${locationId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteLocation(locationId: PropertyModel.PropertyLocationID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/locations/${locationId}`, {
            method: "DELETE",
        })
    }
}

const propertyApi = new PropertyApi()
export default propertyApi
