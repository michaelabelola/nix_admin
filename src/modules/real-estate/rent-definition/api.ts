import type {PropertyModel} from "@/modules/real-estate/property/model.ts"
import type {RentDefinitionModel} from "@/modules/real-estate/rent-definition/model.ts"
import type {SpaceModel} from "@/modules/real-estate/space/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {PagedRequest} from "#/models/PagedModel.ts";

class RentDefinitionApi {
    listByProperty({propertyId, ...query}: PagedRequest<{
        propertyId: PropertyModel.PropertyID
    }>, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition[]>(
            `/real-estate/properties/${propertyId}/rent-definitions`, {
                ...init,
                query: query
            })
    }

    getByProperty(propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/properties/${propertyId}/rent-definitions/${rentDefinitionId}`, init)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: RentDefinitionModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/properties/${propertyId}/rent-definitions`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, body: RentDefinitionModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/properties/${propertyId}/rent-definitions/${rentDefinitionId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}/rent-definitions/${rentDefinitionId}`, {
            method: "DELETE",
            ...init,
        })
    }

    setPropertyDefault(propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/properties/${propertyId}/default-rent/${rentDefinitionId}`, {
            method: "PATCH",
            ...init,
        })
    }

    clearPropertyDefault(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/properties/${propertyId}/default-rent`, {
            method: "DELETE",
            ...init,
        })
    }

    listBySpace(spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition[]>(`/real-estate/space/${spaceId}/rents`, init)
    }

    getBySpace(spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/space/${spaceId}/rents/${rentDefinitionId}`, init)
    }

    createForSpace(spaceId: SpaceModel.SpaceID, body: RentDefinitionModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/space/${spaceId}/rents`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForSpace(spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, body: RentDefinitionModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/space/${spaceId}/rents/${rentDefinitionId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForSpace(spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/space/${spaceId}/rents/${rentDefinitionId}`, {
            method: "DELETE",
            ...init,
        })
    }

    setSpaceDefault(spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-rent/${rentDefinitionId}`, {
            method: "PATCH",
            ...init,
        })
    }

    clearSpaceDefault(spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-rent`, {
            method: "DELETE",
            ...init,
        })
    }

    linkToSpace(spaceId: SpaceModel.SpaceID, rentDefinitionIds: RentDefinitionModel.RentDefinitionID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/rents/links`, {
            method: "POST",
            body: rentDefinitionIds,
            ...init,
        })
    }

    unlinkFromSpace(spaceId: SpaceModel.SpaceID, rentDefinitionIds: RentDefinitionModel.RentDefinitionID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/rents/links`, {
            method: "DELETE",
            body: rentDefinitionIds,
            ...init,
        })
    }
}

const rentDefinitionApi = new RentDefinitionApi()
export default rentDefinitionApi
