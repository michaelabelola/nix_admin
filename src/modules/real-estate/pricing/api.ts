import type {PropertyModel} from "@/modules/real-estate/property/model.ts"
import type {RealEstatePricingModel} from "@/modules/real-estate/pricing/model.ts"
import type {SpaceModel} from "@/modules/real-estate/space/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"

class PricingApi {
    listByProperty(propertyId: PropertyModel.PropertyID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing[]>(`/real-estate/property/${propertyId}/pricings`, init)
    }

    getByProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/property/${propertyId}/pricings/${pricingId}`, init)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: RealEstatePricingModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/property/${propertyId}/pricings`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID, body: RealEstatePricingModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/property/${propertyId}/pricings/${pricingId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/property/${propertyId}/pricings/${pricingId}`, {
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

    listBySpace(spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing[]>(`/real-estate/space/${spaceId}/pricings`, init)
    }

    getBySpace(spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/space/${spaceId}/pricings/${pricingId}`, init)
    }

    createForSpace(spaceId: SpaceModel.SpaceID, body: RealEstatePricingModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/space/${spaceId}/pricings`, {
            method: "POST",
            body,
            ...init,
        })
    }

    updateForSpace(spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID, body: RealEstatePricingModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/space/${spaceId}/pricings/${pricingId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteForSpace(spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/space/${spaceId}/pricings/${pricingId}`, {
            method: "DELETE",
            ...init,
        })
    }

    setSpaceDefault(spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-pricing/${pricingId}`, {
            method: "PATCH",
            ...init,
        })
    }

    clearSpaceDefault(spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-pricing`, {
            method: "DELETE",
            ...init,
        })
    }

    linkToSpace(spaceId: SpaceModel.SpaceID, pricingIds: RealEstatePricingModel.PriceID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/pricings/links`, {
            method: "POST",
            body: pricingIds,
            ...init,
        })
    }

    unlinkFromSpace(spaceId: SpaceModel.SpaceID, pricingIds: RealEstatePricingModel.PriceID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/pricings/links`, {
            method: "DELETE",
            body: pricingIds,
            ...init,
        })
    }
}

const pricingApi = new PricingApi()
export default pricingApi
