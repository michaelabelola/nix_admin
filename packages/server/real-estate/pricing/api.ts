import type {PropertyModel} from "../property/model.ts"
import type {RealEstatePricingModel} from "./model.ts"
import {Backend, type RequestHelperInit} from "../../utils"
import type {ResponseDto} from "@suiteonix/models"
import type {Paged, PagedRequest} from "@suiteonix/models"

class PricingApi {
    listByProperty({propertyId, ...query}: PagedRequest<RealEstatePricingModel.Query & {
        propertyId: PropertyModel.PropertyID
    }>, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<RealEstatePricingModel.RealEstatePricing>>(
            `/real-estate/properties/${propertyId}/pricing-definitions`,
            {
                ...init,
                query,
            },
        )
    }

    getByProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/properties/${propertyId}/pricing-definitions/${pricingId}`, init)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: RealEstatePricingModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/properties/${propertyId}/pricing-definitions`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID, body: RealEstatePricingModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/properties/${propertyId}/pricing-definitions/${pricingId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/properties/${propertyId}/pricing-definitions/${pricingId}`, {
            method: "DELETE",
            ...init,
        })
    }

    setPropertyDefault(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-pricing/${pricingId}`, {
            method: "PATCH",
            ...init,
        })
    }

    clearPropertyDefault(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-pricing`, {
            method: "DELETE",
            ...init,
        })
    }
}

const pricingApi = new PricingApi()
export default pricingApi
