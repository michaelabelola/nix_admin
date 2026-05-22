import type {PropertyFeatureModel} from "./model.ts"
import type {PropertyModel} from "../property/model.ts"
import {Backend, type RequestHelperInit} from "../../utils"
import type {ResponseDto} from "@suiteonix/models"
import type {Paged} from "@suiteonix/models";

class PropertyFeatureApi {
    linkToProperty(propertyId: PropertyModel.PropertyID, featureIds: PropertyFeatureModel.PropertyFeatureID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/features/links`, {
            method: "POST",
            body: featureIds,
            ...init,
        })
    }

    unlinkFromProperty(propertyId: PropertyModel.PropertyID, featureIds: PropertyFeatureModel.PropertyFeatureID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/features/links`, {
            method: "DELETE",
            body: featureIds,
            ...init,
        })
    }

    queryByProperty({propertyId, ...params}: PropertyFeatureModel.Query & {
        propertyId: PropertyModel.PropertyID
    }, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<PropertyFeatureModel.PropertyFeature>>(`/real-estate/properties/${propertyId}/features`, {
            query: params,
            ...init
        })
    }

    getByProperty(propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyFeatureModel.Detailed>(`/real-estate/properties/${propertyId}/features/${featureId}`, init)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: PropertyFeatureModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyFeatureModel.PropertyFeature>(`/real-estate/properties/${propertyId}/features`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID, body: PropertyFeatureModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyFeatureModel.PropertyFeature>(`/real-estate/properties/${propertyId}/features/${featureId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}/features/${featureId}`, {
            method: "DELETE",
            ...init,
        })
    }
}

const propertyFeatureApi = new PropertyFeatureApi()
export default propertyFeatureApi
