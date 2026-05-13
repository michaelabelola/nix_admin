import type {PropertyModel} from "@/modules/real-estate/property/model.ts"
import type {RentDefinitionModel} from "@/modules/real-estate/rent-definition/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {Paged, PagedRequest} from "#/models/PagedModel.ts";

class RentDefinitionApi {
    listByProperty({propertyId, ...query}: PagedRequest<{
        propertyId: PropertyModel.PropertyID
    }>, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<RentDefinitionModel.RentDefinition>>(
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
}

const rentDefinitionApi = new RentDefinitionApi()
export default rentDefinitionApi
