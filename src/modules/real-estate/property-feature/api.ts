import type { PropertyFeatureModel } from "@/modules/real-estate/property-feature/model.ts"
import type { PropertyModel } from "@/modules/real-estate/property/model.ts"
import type { SpaceModel } from "@/modules/real-estate/space/model.ts"
import {Backend} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"

class PropertyFeatureApi {
    linkToProperty(propertyId: PropertyModel.PropertyID, featureIds: PropertyFeatureModel.PropertyFeatureID[]) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/features/links`, {
            method: "POST",
            body: featureIds,
        })
    }

    unlinkFromProperty(propertyId: PropertyModel.PropertyID, featureIds: PropertyFeatureModel.PropertyFeatureID[]) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/features/links`, {
            method: "DELETE",
            body: featureIds,
        })
    }

    linkToSpace(spaceId: SpaceModel.SpaceID, featureIds: PropertyFeatureModel.PropertyFeatureID[], propertyId?: PropertyModel.PropertyID) {
        const route = propertyId
            ? `/real-estate/property/${propertyId}/spaces/${spaceId}/features/links`
            : `/real-estate/space/${spaceId}/features/links`
        return Backend.authRequest<SpaceModel.Detailed>(route, {
            method: "POST",
            body: featureIds,
        })
    }

    unlinkFromSpace(spaceId: SpaceModel.SpaceID, featureIds: PropertyFeatureModel.PropertyFeatureID[], propertyId?: PropertyModel.PropertyID) {
        const route = propertyId
            ? `/real-estate/property/${propertyId}/spaces/${spaceId}/features/links`
            : `/real-estate/space/${spaceId}/features/links`
        return Backend.authRequest<SpaceModel.Detailed>(route, {
            method: "DELETE",
            body: featureIds,
        })
    }

    listByProperty(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<PropertyFeatureModel.PropertyFeature[]>(`/real-estate/properties/${propertyId}/features`)
    }

    getByProperty(propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID) {
        return Backend.authRequest<PropertyFeatureModel.Detailed>(`/real-estate/properties/${propertyId}/features/${featureId}`)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: PropertyFeatureModel.Create) {
        return Backend.authRequest<PropertyFeatureModel.PropertyFeature>(`/real-estate/properties/${propertyId}/features`, {
            method: "POST",
            body,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID, body: PropertyFeatureModel.Update) {
        return Backend.authRequest<PropertyFeatureModel.PropertyFeature>(`/real-estate/properties/${propertyId}/features/${featureId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}/features/${featureId}`, {
            method: "DELETE",
        })
    }
}

const propertyFeatureApi = new PropertyFeatureApi()
export default propertyFeatureApi
