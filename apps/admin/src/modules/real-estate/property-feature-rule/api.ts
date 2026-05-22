import type {PropertyFeatureRuleModel} from "#/modules/real-estate/property-feature-rule/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {Paged} from "#/models/PagedModel.ts"

class PropertyFeatureRuleApi {
    query(params?: PropertyFeatureRuleModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<PropertyFeatureRuleModel.PropertyFeatureRule>>("/real-estate/feature-rules", {query: params, ...init})
    }

    getById(featureRuleId: PropertyFeatureRuleModel.FeatureRuleID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyFeatureRuleModel.Detailed>(`/real-estate/feature-rules/${featureRuleId}`, init)
    }

    create(body: PropertyFeatureRuleModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyFeatureRuleModel.PropertyFeatureRule>("/real-estate/feature-rules", {
            method: "POST",
            body,
            ...init,
        })
    }

    update(featureRuleId: PropertyFeatureRuleModel.FeatureRuleID, body: PropertyFeatureRuleModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyFeatureRuleModel.PropertyFeatureRule>(`/real-estate/feature-rules/${featureRuleId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    delete(featureRuleId: PropertyFeatureRuleModel.FeatureRuleID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/feature-rules/${featureRuleId}`, {
            method: "DELETE",
            ...init,
        })
    }
}

const propertyFeatureRuleApi = new PropertyFeatureRuleApi()
export default propertyFeatureRuleApi
