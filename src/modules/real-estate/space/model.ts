import type { AuditSection, NixID } from "@/models/Models.ts"
import type { LeaseDefinitionModel } from "../lease-definition/model.ts"
import type { RealEstatePricingModel } from "../pricing/model.ts"
import type { PropertyFeatureModel } from "../property-feature/model.ts"
import type { PropertyModel } from "../property/model.ts"
import type { RentDefinitionModel } from "../rent-definition/model.ts"

export namespace SpaceModel {
    export type SpaceID = string | number
    export type SpaceTypeID = string | number
    export type PropertyID = string
    export type TagID = string
    export type NixFile = string | null

    export enum SpaceEnclosureType {
        OPEN = "OPEN",
        COVERED = "COVERED",
        ENCLOSED = "ENCLOSED",
    }

    export enum SpaceAccessType {
        PUBLIC = "PUBLIC",
        PRIVATE = "PRIVATE",
        RESTRICTED = "RESTRICTED",
    }

    export enum SpaceTypeCategory {
        SLEEPING = "SLEEPING",
        LIVING = "LIVING",
        KITCHEN_DINING = "KITCHEN_DINING",
        BATHROOM_WELLNESS = "BATHROOM_WELLNESS",
        WORK_STUDY = "WORK_STUDY",
        STORAGE_UTILITY = "STORAGE_UTILITY",
        RECREATION_ENTERTAINMENT = "RECREATION_ENTERTAINMENT",
        OUTDOOR = "OUTDOOR",
        SERVICE = "SERVICE",
        MISC = "MISC",
        CUSTOM = "CUSTOM",
    }

    export type SpaceType = {
        id: SpaceTypeID
        name: string | null
        description: string | null
        category: SpaceTypeCategory | null
        colorHex: string | null
        icon: NixFile
    }

    export type SpaceTypeDetailed = {
        id: SpaceTypeID
        name: string | null
        description: string | null
        category: SpaceTypeCategory | null
        colorHex: string | null
        icon: NixFile
        entityID: NixID
        audit: AuditSection
    }

    export type Space = {
        id: SpaceID
        propertyId: PropertyID | null
        location: PropertyModel.PropertyLocation | null
        label: string | null
        types: SpaceType[]
        sizeInSqm: number | null
        description: string | null
        about: string | null
        enclosureType: SpaceEnclosureType | null
        accessType: SpaceAccessType | null
        defaultPricing: RealEstatePricingModel.RealEstatePricing | null
        defaultRentDefinition: RentDefinitionModel.RentDefinition | null
        defaultLeaseDefinition: LeaseDefinitionModel.LeaseDefinition | null
        tags: TagID[]
    }

    export type Detailed = {
        id: SpaceID
        propertyId: PropertyID | null
        location: PropertyModel.PropertyLocationDetailed | null
        label: string | null
        types: SpaceTypeDetailed[]
        sizeInSqm: number | null
        description: string | null
        about: string | null
        enclosureType: SpaceEnclosureType | null
        accessType: SpaceAccessType | null
        defaultPricing: RealEstatePricingModel.RealEstatePricing | null
        defaultRentDefinition: RentDefinitionModel.RentDefinition | null
        defaultLeaseDefinition: LeaseDefinitionModel.LeaseDefinition | null
        features: PropertyFeatureModel.PropertyFeature[]
        tags: TagID[]
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        propertyId?: PropertyID | null
        locationId?: PropertyModel.PropertyLocationID | null
        label?: string | null
        typeIds?: SpaceTypeID[]
        sizeInSqm?: number | null
        description?: string | null
        about?: string | null
        enclosureType?: SpaceEnclosureType | null
        accessType?: SpaceAccessType | null
        featureIds?: PropertyFeatureModel.PropertyFeatureID[]
        tagIds?: TagID[]
        pricingDefinitionIds?: RealEstatePricingModel.PriceID[]
        defaultPricingId?: RealEstatePricingModel.PriceID | null
        rentDefinitionIds?: RentDefinitionModel.RentDefinitionID[]
        defaultRentDefinitionId?: RentDefinitionModel.RentDefinitionID | null
        leaseDefinitionIds?: LeaseDefinitionModel.LeaseDefinitionID[]
        defaultLeaseDefinitionId?: LeaseDefinitionModel.LeaseDefinitionID | null
    }

    export type Update = {
        propertyId?: PropertyID | null
        locationId?: PropertyModel.PropertyLocationID | null
        label?: string | null
        typeIds?: SpaceTypeID[]
        sizeInSqm?: number | null
        description?: string | null
        about?: string | null
        enclosureType?: SpaceEnclosureType | null
        accessType?: SpaceAccessType | null
        tagIds?: TagID[]
    }
}
