import type { PropertyModel } from "@/modules/real-estate/property/model.ts"
import type { RentDefinitionModel } from "@/modules/real-estate/rent-definition/model.ts"
import type { SpaceModel } from "@/modules/real-estate/space/model.ts"
import {Backend} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"

class RentDefinitionApi {
    listByProperty(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition[]>(`/real-estate/property/${propertyId}/rents`)
    }

    getByProperty(propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/property/${propertyId}/rents/${rentDefinitionId}`)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: RentDefinitionModel.Create) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/property/${propertyId}/rents`, {
            method: "POST",
            body,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, body: RentDefinitionModel.Update) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/property/${propertyId}/rents/${rentDefinitionId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/property/${propertyId}/rents/${rentDefinitionId}`, {
            method: "DELETE",
        })
    }

    setPropertyDefault(propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-rent/${rentDefinitionId}`, {
            method: "PATCH",
        })
    }

    clearPropertyDefault(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-rent`, {
            method: "DELETE",
        })
    }

    listBySpace(spaceId: SpaceModel.SpaceID) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition[]>(`/real-estate/space/${spaceId}/rents`)
    }

    getBySpace(spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/space/${spaceId}/rents/${rentDefinitionId}`)
    }

    createForSpace(spaceId: SpaceModel.SpaceID, body: RentDefinitionModel.Create) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/space/${spaceId}/rents`, {
            method: "POST",
            body,
        })
    }

    updateForSpace(spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID, body: RentDefinitionModel.Update) {
        return Backend.authRequest<RentDefinitionModel.RentDefinition>(`/real-estate/space/${spaceId}/rents/${rentDefinitionId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteForSpace(spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/space/${spaceId}/rents/${rentDefinitionId}`, {
            method: "DELETE",
        })
    }

    setSpaceDefault(spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-rent/${rentDefinitionId}`, {
            method: "PATCH",
        })
    }

    clearSpaceDefault(spaceId: SpaceModel.SpaceID) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-rent`, {
            method: "DELETE",
        })
    }

    linkToSpace(spaceId: SpaceModel.SpaceID, rentDefinitionIds: RentDefinitionModel.RentDefinitionID[]) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/rents/links`, {
            method: "POST",
            body: rentDefinitionIds,
        })
    }

    unlinkFromSpace(spaceId: SpaceModel.SpaceID, rentDefinitionIds: RentDefinitionModel.RentDefinitionID[]) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/rents/links`, {
            method: "DELETE",
            body: rentDefinitionIds,
        })
    }
}

const rentDefinitionApi = new RentDefinitionApi()
export default rentDefinitionApi
