import type { LeaseDefinitionModel } from "@/modules/real-estate/lease-definition/model.ts"
import type { PropertyModel } from "@/modules/real-estate/property/model.ts"
import type { SpaceModel } from "@/modules/real-estate/space/model.ts"
import {Backend} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"

class LeaseDefinitionApi {
    listByProperty(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition[]>(`/real-estate/property/${propertyId}/leases`)
    }

    getByProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/property/${propertyId}/leases/${leaseDefinitionId}`)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: LeaseDefinitionModel.Create) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/property/${propertyId}/leases`, {
            method: "POST",
            body,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/property/${propertyId}/leases/${leaseDefinitionId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/property/${propertyId}/leases/${leaseDefinitionId}`, {
            method: "DELETE",
        })
    }

    setPropertyDefault(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-lease/${leaseDefinitionId}`, {
            method: "PATCH",
        })
    }

    clearPropertyDefault(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-lease`, {
            method: "DELETE",
        })
    }

    listBySpace(spaceId: SpaceModel.SpaceID) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition[]>(`/real-estate/space/${spaceId}/leases`)
    }

    getBySpace(spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/space/${spaceId}/leases/${leaseDefinitionId}`)
    }

    createForSpace(spaceId: SpaceModel.SpaceID, body: LeaseDefinitionModel.Create) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/space/${spaceId}/leases`, {
            method: "POST",
            body,
        })
    }

    updateForSpace(spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/space/${spaceId}/leases/${leaseDefinitionId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteForSpace(spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/space/${spaceId}/leases/${leaseDefinitionId}`, {
            method: "DELETE",
        })
    }

    setSpaceDefault(spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-lease/${leaseDefinitionId}`, {
            method: "PATCH",
        })
    }

    clearSpaceDefault(spaceId: SpaceModel.SpaceID) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-lease`, {
            method: "DELETE",
        })
    }

    linkToSpace(spaceId: SpaceModel.SpaceID, leaseDefinitionIds: LeaseDefinitionModel.LeaseDefinitionID[]) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/leases/links`, {
            method: "POST",
            body: leaseDefinitionIds,
        })
    }

    unlinkFromSpace(spaceId: SpaceModel.SpaceID, leaseDefinitionIds: LeaseDefinitionModel.LeaseDefinitionID[]) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/leases/links`, {
            method: "DELETE",
            body: leaseDefinitionIds,
        })
    }
}

const leaseDefinitionApi = new LeaseDefinitionApi()
export default leaseDefinitionApi
