import type {Money} from "#/models/Money.model.ts"
import type {AuditSection, NixID} from "#/models/Models.ts"
import type {NixFile} from "#/models/NixFile.ts"
import type {PagedRequest} from "#/models/PagedModel.ts"
import type {PropertyFeatureModel} from "#/modules/real-estate/property-feature/model.ts"
import type {PropertyModel} from "#/modules/real-estate/property/model.ts"
import type {LeaseDefinitionModel} from "#/modules/real-estate/lease-definition/model.ts"
import type {RentDefinitionModel} from "#/modules/real-estate/rent-definition/model.ts"

export namespace PropertyListingProfileModel {
    export type ListingProfileID = string
    export type PriceID = string | number
    export type TagID = string
    export type FileID = string

    export type Location = {
        id: PropertyModel.PropertyLocationID | null
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
        loc_lat: number | null
        loc_long: number | null
        distance: number | null
    }

    export type Tag = {
        id: TagID
        name: string | null
        colorHex: string | null
    }

    export type Price = {
        id: PriceID
        amount: Money | null
    }

    export type Feature = {
        id: PropertyFeatureModel.PropertyFeatureID
        name: string | null
        description: string | null
        format: PropertyFeatureModel.FieldFormat | null
        booleanValue: boolean | null
        decimalValue: number | null
        stringValue: string | null
        textValue: string | null
        timeValue: string | null
        unit: string | null
    }

    export type Rent = {
        id: RentDefinitionModel.RentDefinitionID
        description: string | null
        amount: Money | null
        duration: number | null
        durationUnit: RentDefinitionModel.RentDurationUnit | null
    }

    export type Lease = {
        id: LeaseDefinitionModel.LeaseDefinitionID
        description: string | null
        amount: Money | null
        duration: number | null
        durationUnit: LeaseDefinitionModel.LeaseDurationUnit | null
    }

    export type GalleryItem = {
        id: FileID
        name: string | null
        description: string | null
        file: NixFile.NixFile
        thumbnail: NixFile.NixImage
        isCoverImage: boolean | null
    }

    export type PropertyListingProfile = {
        id: ListingProfileID
        propertyID: PropertyModel.PropertyID
        name: string | null
        description: string | null
        avatar: NixFile.NixImage
        gallery: GalleryItem[]
        location: Location | null
        type: PropertyModel.PropertyType | null
        tags: Tag[]
        price: Price | null
        features: Feature[]
        rent: Rent | null
        lease: Lease | null
        isDefault: boolean | null
    }

    export type Detailed = PropertyListingProfile & {
        about: string | null
        entityID: NixID
        audit: AuditSection
    }

    export type Query = PagedRequest<{
        id?: ListingProfileID
        propertyID?: PropertyModel.PropertyID
        name?: string
        isDefault?: boolean
        type?: PropertyModel.PropertyType
    }>
}
