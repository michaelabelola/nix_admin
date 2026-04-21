import type { PropertyModel } from "@/modules/real-estate/property/model.ts"
import type { SpaceModel } from "@/modules/real-estate/space/model.ts"
import {Backend} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {PageRequest, Paged} from "#/models/PagedModel.ts"

class SpaceApi {
    queryTypes(params?: PageRequest) {
        return Backend.authRequest<Paged<SpaceModel.SpaceType>>("/real-estate/space-types", {query: params})
    }

    getType(spaceTypeId: SpaceModel.SpaceTypeID) {
        return Backend.authRequest<SpaceModel.SpaceTypeDetailed>(`/real-estate/space-types/${spaceTypeId}`)
    }

    createType(body: SpaceModel.CreateSpaceType) {
        return Backend.authRequest<SpaceModel.SpaceType>("/real-estate/space-types", {
            method: "POST",
            body,
        })
    }

    updateType(spaceTypeId: SpaceModel.SpaceTypeID, body: SpaceModel.UpdateSpaceType) {
        return Backend.authRequest<SpaceModel.SpaceType>(`/real-estate/space-types/${spaceTypeId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteType(spaceTypeId: SpaceModel.SpaceTypeID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/space-types/${spaceTypeId}`, {
            method: "DELETE",
        })
    }

    queryByProperty(propertyId: PropertyModel.PropertyID, params?: PageRequest) {
        return Backend.authRequest<Paged<SpaceModel.Space>>(`/real-estate/properties/${propertyId}/spaces`, {query: params})
    }

    getById(propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/properties/${propertyId}/spaces/${spaceId}`)
    }

    create(propertyId: PropertyModel.PropertyID, body: SpaceModel.Create) {
        return Backend.authRequest<SpaceModel.Space>(`/real-estate/properties/${propertyId}/spaces`, {
            method: "POST",
            body,
        })
    }

    update(propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID, body: SpaceModel.Update) {
        return Backend.authRequest<SpaceModel.Space>(`/real-estate/properties/${propertyId}/spaces/${spaceId}`, {
            method: "PATCH",
            body,
        })
    }

    addTags(spaceId: SpaceModel.SpaceID, tagIds: SpaceModel.TagID[], propertyId?: PropertyModel.PropertyID) {
        const route = propertyId
            ? `/real-estate/property/${propertyId}/spaces/${spaceId}/tags`
            : `/real-estate/space/${spaceId}/tags`
        return Backend.authRequest<SpaceModel.Space>(route, {
            method: "POST",
            body: tagIds,
        })
    }

    removeTags(spaceId: SpaceModel.SpaceID, tagIds: SpaceModel.TagID[], propertyId?: PropertyModel.PropertyID) {
        const route = propertyId
            ? `/real-estate/property/${propertyId}/spaces/${spaceId}/tags`
            : `/real-estate/space/${spaceId}/tags`
        return Backend.authRequest<SpaceModel.Space>(route, {
            method: "DELETE",
            body: tagIds,
        })
    }

    delete(propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}/spaces/${spaceId}`, {
            method: "DELETE",
        })
    }
}

const spaceApi = new SpaceApi()
export default spaceApi
