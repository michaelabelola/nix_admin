import type {LeaseDefinitionModel} from "@/modules/real-estate/lease-definition/model.ts"
import type {PropertyModel} from "@/modules/real-estate/property/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {Paged, PagedRequest} from "#/models/PagedModel.ts"

class LeaseDefinitionApi {
    listByProperty({propertyId, ...query}: PagedRequest<{
        propertyId: PropertyModel.PropertyID
    }>, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<LeaseDefinitionModel.LeaseDefinition>>(
            `/real-estate/properties/${propertyId}/lease-definitions`,
            {
                ...init,
                query,
            },
        )
    }

    getByProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/properties/${propertyId}/lease-definitions/${leaseDefinitionId}`, init)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: LeaseDefinitionModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/properties/${propertyId}/lease-definitions`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, body: LeaseDefinitionModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<LeaseDefinitionModel.LeaseDefinition>(`/real-estate/properties/${propertyId}/lease-definitions/${leaseDefinitionId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}/lease-definitions/${leaseDefinitionId}`, {
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
}

const leaseDefinitionApi = new LeaseDefinitionApi()
export default leaseDefinitionApi
