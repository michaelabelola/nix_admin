import type {PropertyModel} from "@/modules/real-estate/property/model.ts"
import type {SpaceModel} from "@/modules/real-estate/space/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {PageRequest, Paged} from "#/models/PagedModel.ts"

class SpaceApi {
    queryTypes(params?: PageRequest, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<SpaceModel.SpaceType>>("/real-estate/space-types", {query: params, ...init})
    }

    getType(spaceTypeId: SpaceModel.SpaceTypeID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.SpaceTypeDetailed>(`/real-estate/space-types/${spaceTypeId}`, init)
    }

    createType(body: SpaceModel.CreateSpaceType, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.SpaceType>("/real-estate/space-types", {
            method: "POST",
            body,
            ...init,
        })
    }

    updateType(spaceTypeId: SpaceModel.SpaceTypeID, body: SpaceModel.UpdateSpaceType, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.SpaceType>(`/real-estate/space-types/${spaceTypeId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteType(spaceTypeId: SpaceModel.SpaceTypeID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/space-types/${spaceTypeId}`, {
            method: "DELETE",
            ...init,
        })
    }

    queryByProperty(propertyId: PropertyModel.PropertyID, params?: PageRequest, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<SpaceModel.Space>>(`/real-estate/properties/${propertyId}/spaces`, {query: params, ...init})
    }

    getById(propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/properties/${propertyId}/spaces/${spaceId}`, init)
    }

    create(propertyId: PropertyModel.PropertyID, body: SpaceModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Space>(`/real-estate/properties/${propertyId}/spaces`, {
            method: "POST",
            body,
            ...init,
        })
    }

    update(propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID, body: SpaceModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Space>(`/real-estate/properties/${propertyId}/spaces/${spaceId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    addTags(spaceId: SpaceModel.SpaceID, tagIds: SpaceModel.TagID[], propertyId?: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        const route = propertyId
            ? `/real-estate/property/${propertyId}/spaces/${spaceId}/tags`
            : `/real-estate/space/${spaceId}/tags`
        return Backend.authRequest<SpaceModel.Space>(route, {
            method: "POST",
            body: tagIds,
            ...init,
        })
    }

    removeTags(spaceId: SpaceModel.SpaceID, tagIds: SpaceModel.TagID[], propertyId?: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        const route = propertyId
            ? `/real-estate/property/${propertyId}/spaces/${spaceId}/tags`
            : `/real-estate/space/${spaceId}/tags`
        return Backend.authRequest<SpaceModel.Space>(route, {
            method: "DELETE",
            body: tagIds,
            ...init,
        })
    }

    delete(propertyId: PropertyModel.PropertyID, spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}/spaces/${spaceId}`, {
            method: "DELETE",
            ...init,
        })
    }
}

const spaceApi = new SpaceApi()
export default spaceApi
