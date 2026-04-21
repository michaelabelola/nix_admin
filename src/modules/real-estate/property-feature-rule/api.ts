import type { PropertyFeatureRuleModel } from "@/modules/real-estate/property-feature-rule/model.ts"
import {Backend} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {PageRequest, Paged} from "#/models/PagedModel.ts"

class PropertyFeatureRuleApi {
    query(params?: PageRequest) {
        return Backend.authRequest<Paged<PropertyFeatureRuleModel.PropertyFeatureRule>>("/real-estate/feature-rules", {query: params})
    }

    getById(featureRuleId: PropertyFeatureRuleModel.FeatureRuleID) {
        return Backend.authRequest<PropertyFeatureRuleModel.Detailed>(`/real-estate/feature-rules/${featureRuleId}`)
    }

    create(body: PropertyFeatureRuleModel.Create) {
        return Backend.authRequest<PropertyFeatureRuleModel.PropertyFeatureRule>("/real-estate/feature-rules", {
            method: "POST",
            body,
        })
    }

    update(featureRuleId: PropertyFeatureRuleModel.FeatureRuleID, body: PropertyFeatureRuleModel.Update) {
        return Backend.authRequest<PropertyFeatureRuleModel.PropertyFeatureRule>(`/real-estate/feature-rules/${featureRuleId}`, {
            method: "PATCH",
            body,
        })
    }

    delete(featureRuleId: PropertyFeatureRuleModel.FeatureRuleID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/feature-rules/${featureRuleId}`, {
            method: "DELETE",
        })
    }
}

const propertyFeatureRuleApi = new PropertyFeatureRuleApi()
export default propertyFeatureRuleApi
