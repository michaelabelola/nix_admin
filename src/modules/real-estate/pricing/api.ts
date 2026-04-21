import type {PropertyModel} from "@/modules/real-estate/property/model.ts"
import type {RealEstatePricingModel} from "@/modules/real-estate/pricing/model.ts"
import type {SpaceModel} from "@/modules/real-estate/space/model.ts"
import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {ResponseDto} from "#/models/Models.ts"
import type {ErrorHandlerType} from "#/lib/request.types.tsx";

class PricingApi {
    listByProperty(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing[]>(`/real-estate/property/${propertyId}/pricings`)
    }

    getByProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/property/${propertyId}/pricings/${pricingId}`)
    }

    createForProperty(propertyId: PropertyModel.PropertyID, body: RealEstatePricingModel.Create) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/property/${propertyId}/pricings`, {
            method: "POST",
            body,
        })
    }

    updateForProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID, body: RealEstatePricingModel.Update) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/property/${propertyId}/pricings/${pricingId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteForProperty(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/property/${propertyId}/pricings/${pricingId}`, {
            method: "DELETE",
        })
    }

    setPropertyDefault(propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-pricing/${pricingId}`, {
            method: "PATCH",
        })
    }

    clearPropertyDefault(propertyId: PropertyModel.PropertyID) {
        return Backend.authRequest<PropertyModel.Detailed>(`/real-estate/property/${propertyId}/default-pricing`, {
            method: "DELETE",
        })
    }

    listBySpace(spaceId: SpaceModel.SpaceID) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing[]>(`/real-estate/space/${spaceId}/pricings`)
    }

    getBySpace(spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/space/${spaceId}/pricings/${pricingId}`)
    }

    createForSpace(spaceId: SpaceModel.SpaceID, body: RealEstatePricingModel.Create) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/space/${spaceId}/pricings`, {
            method: "POST",
            body,
        })
    }

    updateForSpace(spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID, body: RealEstatePricingModel.Update) {
        return Backend.authRequest<RealEstatePricingModel.RealEstatePricing>(`/real-estate/space/${spaceId}/pricings/${pricingId}`, {
            method: "PATCH",
            body,
        })
    }

    deleteForSpace(spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID) {
        return Backend.authRequest<ResponseDto<void>>(`/real-estate/space/${spaceId}/pricings/${pricingId}`, {
            method: "DELETE",
        })
    }

    setSpaceDefault(spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-pricing/${pricingId}`, {
            method: "PATCH",
        })
    }

    clearSpaceDefault(spaceId: SpaceModel.SpaceID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/default-pricing`, {
            method: "DELETE",
            ...init
        })
    }

    linkToSpace(spaceId: SpaceModel.SpaceID, pricingIds: RealEstatePricingModel.PriceID[]) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/pricings/links`, {
            method: "POST",
            body: pricingIds,
        })
    }

    unlinkFromSpace(spaceId: SpaceModel.SpaceID, pricingIds: RealEstatePricingModel.PriceID[]) {
        return Backend.authRequest<SpaceModel.Detailed>(`/real-estate/space/${spaceId}/pricings/links`, {
            method: "DELETE",
            body: pricingIds,
        })
    }
}

const pricingApi = new PricingApi()
export default pricingApi
