import type { AuditSection, NixID } from "@/models/Models.ts"
import type { LeaseDefinitionModel } from "../lease-definition/model.ts"
import type { RealEstatePricingModel } from "../pricing/model.ts"
import type { RentDefinitionModel } from "../rent-definition/model.ts"
import type { SpaceModel } from "../space/model.ts"

export namespace PropertyModel {
    export type PropertyID = string
    export type PropertyLocationID = string
    export type FilesStorageID = string | number
    export type TagID = string
    export type NixFile = string | null

    export enum PropertyType {
        HOUSE = "HOUSE",
        APARTMENT = "APARTMENT",
        STUDIO = "STUDIO",
        DUPLEX = "DUPLEX",
        PENTHOUSE = "PENTHOUSE",
        VILLA = "VILLA",
        TOWNHOUSE = "TOWNHOUSE",
        LAND = "LAND",
        OTHER = "OTHER",
    }

    export enum PropertyLifecycleStage {
        ONBOARDING = "ONBOARDING",
        REGISTERED = "REGISTERED",
        LISTED = "LISTED",
    }

    export type PropertyLocation = {
        id: PropertyLocationID
        label: string | null
        apartment: string | null
        unit: string | null
        building: string | null
        floor: number | null
        line1: string | null
        line2: string | null
        city: string | null
        state: string | null
        postalCode: string | null
        country: string | null
        latitude: number | null
        longitude: number | null
    }

    export type PropertyLocationDetailed = {
        id: PropertyLocationID
        label: string | null
        apartment: string | null
        unit: string | null
        building: string | null
        floor: number | null
        line1: string | null
        line2: string | null
        city: string | null
        state: string | null
        postalCode: string | null
        country: string | null
        latitude: number | null
        longitude: number | null
        ref: PropertyLocationID | null
        entityID: NixID
        audit: AuditSection
    }

    export type PropertyLocationCreate = {
        label?: string | null
        apartment?: string | null
        unit?: string | null
        building?: string | null
        floor?: number | null
        line1?: string | null
        line2?: string | null
        city?: string | null
        state?: string | null
        postalCode?: string | null
        country?: string | null
        latitude?: number | null
        longitude?: number | null
        refId?: string | null
    }

    export type PropertyLocationUpdate = PropertyLocationCreate

    export type Property = {
        id: PropertyID
        name: string | null
        description: string | null
        about: string | null
        avatar: NixFile
        storageID: FilesStorageID | null
        location: PropertyLocation | null
        type: PropertyType | null
        lifecycleStage: PropertyLifecycleStage | null
        tags: TagID[]
        pricing: RealEstatePricingModel.RealEstatePricing | null
        rent: RentDefinitionModel.RentDefinition | null
        leaseDefinition: LeaseDefinitionModel.LeaseDefinition | null
    }

    export type Detailed = {
        id: PropertyID
        name: string | null
        description: string | null
        about: string | null
        avatar: NixFile
        storageID: FilesStorageID | null
        location: PropertyLocationDetailed | null
        type: PropertyType | null
        lifecycleStage: PropertyLifecycleStage | null
        tags: TagID[]
        defaultPriceDefinition: RealEstatePricingModel.RealEstatePricing | null
        priceDefinitions: RealEstatePricingModel.RealEstatePricing[]
        defaultRentDefinition: RentDefinitionModel.RentDefinition | null
        rentDefinitions: RentDefinitionModel.RentDefinition[]
        defaultLeaseDefinition: LeaseDefinitionModel.LeaseDefinition | null
        leaseDefinitions: LeaseDefinitionModel.LeaseDefinition[]
        spaces: SpaceModel.Space[]
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        name: string
        description?: string | null
        type: PropertyType
    }

    export type Update = {
        name?: string | null
        description?: string | null
        about?: string | null
        type?: PropertyType | null
    }
}
