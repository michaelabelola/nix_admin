import type {Money, Money_RangedQuery} from "@suiteonix/models"
import type {NixID} from "@suiteonix/models"
import type {NixFile} from "@suiteonix/models"
import type {PagedRequest} from "@suiteonix/models"
import type {LeaseDefinitionModel} from "../real-estate/lease-definition/model.ts"
import type {PropertyFeatureModel} from "../real-estate/property-feature/model.ts"
import type {PropertyModel} from "../real-estate/property/model.ts"
import type {RentDefinitionModel} from "../real-estate/rent-definition/model.ts"

import type {ListingModel} from "./model.ts"

export namespace ListingQuerierModel {


    export type RangeQuery<T> = {
        start?: T
        end?: T
        value?: T
    }

    export type LocationQuery = {
        city?: string
        state?: string
        postalCode?: string
        country?: string
        loc_lat?: number
        loc_long?: number
        nearest?: boolean
    }

    export type TagQuery = {
        id?: PropertyModel.TagID
        name?: string
    }

    export type FeatureQuery = {
        format?: PropertyFeatureModel.FieldFormat
        value?: string
        unit?: string
    }

    export type RentQuery = {
        amount?: RangeQuery<number>
        currencyCode?: string
        duration?: RangeQuery<number>
        durationUnit?: RentDefinitionModel.RentDurationUnit
    }

    export type LeaseQuery = {
        amount?: RangeQuery<number>
        currencyCode?: string
        duration?: RangeQuery<number>
        durationUnit?: LeaseDefinitionModel.LeaseDurationUnit
    }

    export type AuditQuery = {
        createdBy?: NixID
        createdDate?: RangeQuery<string>
        modifiedDate?: RangeQuery<string>
    }

    export type Request = PagedRequest<{
        name?: string
        about?: string
        location?: LocationQuery
        type?: PropertyModel.PropertyType
        tags?: TagQuery[]
        price?: Money_RangedQuery
        feature?: FeatureQuery[]
        rent?: RentQuery
        lease?: LeaseQuery
        entityID?: NixID
        audit?: AuditQuery
        listingID?: ListingModel.ListingID
        show?: string
    }>

    export type ResponseLocation = {
        city: string | null
        state: string | null
        postalCode: string | null
        country: string | null
        loc_lat: number | null
        loc_long: number | null
        distance: number | null
    }

    export type ResponseFeature = {
        name: string | null
        format: PropertyFeatureModel.FieldFormat | null
        value: string | null
        unit: string | null
    }

    export type ResponseRent = {
        amount: number | null
        currencyCode: string | null
        duration: number | null
        durationUnit: RentDefinitionModel.RentDurationUnit | null
    }

    export type ResponseLease = {
        amount: number | null
        currencyCode: string | null
        duration: number | null
        durationUnit: LeaseDefinitionModel.LeaseDurationUnit | null
    }

    export type Response = {
        id: string
        propertyID: PropertyModel.PropertyID
        name: string | null
        description: string | null
        avatar: NixFile.NixImage
        location: ResponseLocation | null
        type: PropertyModel.PropertyType | null
        price: Money | null
        features: ResponseFeature[]
        rent: ResponseRent | null
        lease: ResponseLease | null
        entityID: NixID
        listedOn: string | null
    }
}
