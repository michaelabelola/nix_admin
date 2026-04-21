import type {LeaseDefinitionModel} from "@/modules/real-estate/lease-definition/model.ts"
import type {PropertyModel} from "@/modules/real-estate/property/model.ts"
import type {SpaceModel} from "@/modules/real-estate/space/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"

class LeaseDefinitionApi {
    listByProperty(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition[]>(`/real-estate/property/${propertyId}/leases`, init)
    }

    getByProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/property/${propertyId}/leases/${leaseDefinitionId}`, init)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: LeaseDefinitionModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/property/${propertyId}/leases`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/property/${propertyId}/leases/${leaseDefinitionId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/property/${propertyId}/leases/${leaseDefinitionId}`, {
            method: "DELETE",
            ...init,
        })
    }

    setPropertyDefault(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-lease/${leaseDefinitionId}`, {
            method: "PATCH",
            ...init,
        })
    }

    clearPropertyDefault(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-lease`, {
            method: "DELETE",
            ...init,
        })
    }

    listBySpace(spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition[]>(`/real-estate/space/${spaceId}/leases`, init)
    }

    getBySpace(spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/space/${spaceId}/leases/${leaseDefinitionId}`, init)
    }

    createForSpace(spaceId: SpaceModel.SpaceID, body: LeaseDefinitionModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/space/${spaceId}/leases`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForSpace(spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/space/${spaceId}/leases/${leaseDefinitionId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForSpace(spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/space/${spaceId}/leases/${leaseDefinitionId}`, {
            method: "DELETE",
            ...init,
        })
    }

    setSpaceDefault(spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-lease/${leaseDefinitionId}`, {
            method: "PATCH",
            ...init,
        })
    }

    clearSpaceDefault(spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-lease`, {
            method: "DELETE",
            ...init,
        })
    }

    linkToSpace(spaceId: SpaceModel.SpaceID, leaseDefinitionIds: LeaseDefinitionModel.LeaseDefinitionID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/leases/links`, {
            method: "POST",
            body: leaseDefinitionIds,
            ...init,
        })
    }

    unlinkFromSpace(spaceId: SpaceModel.SpaceID, leaseDefinitionIds: LeaseDefinitionModel.LeaseDefinitionID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/leases/links`, {
            method: "DELETE",
            body: leaseDefinitionIds,
            ...init,
        })
    }
}

const leaseDefinitionApi = new LeaseDefinitionApi()
export default leaseDefinitionApi
