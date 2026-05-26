import type {AuditSection, NixID} from "@suiteonix/models"
import type {NixFile} from "@suiteonix/models"
import type {ObjectVisibility, PagedRequest} from "@suiteonix/models"
import type {TagModel} from "../tags/model.ts"

export namespace CustomerModel {
    export type CustomerID = string
    export type CustomerAvatar = NixFile.NixImage

    export enum CustomerStatus {
        ACTIVE = "ACTIVE",
        INACTIVE = "INACTIVE",
        SUSPENDED = "SUSPENDED",
        DELETED = "DELETED",
    }

    export enum CustomerType {
        INDIVIDUAL = "INDIVIDUAL",
        BUSINESS = "BUSINESS",
        GOVERNMENT = "GOVERNMENT",
        PARTNER = "PARTNER",
        INTERNAL = "INTERNAL",
    }

    export enum CustomerLifecycleStage {
        LEAD = "LEAD",
        PROSPECT = "PROSPECT",
        CUSTOMER = "CUSTOMER",
    }

    export type PersonalDetail = {
        firstName?: string | null
        middleName?: string | null
        lastName?: string | null
        title?: string | null
        gender?: string | null
        dateOfBirth?: string | null
        nationality?: string | null
        passportNumber?: string | null
        nationalID?: string | null
        maritalStatus?: string | null
        mothersMaidenName?: string | null
        countryOfBirth?: string | null
        profession?: string | null
    }

    export type BusinessDetail = {
        companyName?: string | null
        registrationNumber?: string | null
        taxID?: string | null
        industry?: string | null
        companySize?: number | null
        businessType?: string | null
        legalForm?: string | null
        registrationDate?: string | null
    }

    export type Contact = {
        email?: string | null
        secondaryEmail?: string | null
        phoneNumber?: string | null
        mobileNumber?: string | null
        faxNumber?: string | null
        website?: string | null
    }

    export type Address = {
        id?: string | null
        label?: string | null
        line1?: string | null
        line2?: string | null
        city?: string | null
        state?: string | null
        province?: string | null
        postalCode?: string | null
        country?: string | null
        latitude?: number | null
        longitude?: number | null
    }

    export type CreateAddress = Omit<Address, "id">

    export type Preferences = {
        marketingConsent?: boolean | null
        emailNotifications?: boolean | null
        smsNotifications?: boolean | null
        attributes?: Record<string, string> | null
    }

    export type SelfContact = {
        secondaryEmail?: string | null
        phoneNumber?: string | null
        mobileNumber?: string | null
        website?: string | null
    }

    export type SelfPreferences = Preferences

    export type CustomerSegment = {
        id: string
        name?: string | null
        description?: string | null
        colorHex?: string | null
        entityID?: NixID
    }

    export type Customer = {
        id: CustomerID
        displayName?: string | null
        type?: CustomerType | null
        avatar?: NixFile.NixImage
        lifecycleStage?: CustomerLifecycleStage | null
        status?: CustomerStatus | null
        storageID?: string | number | null
        entityID: NixID
    }

    export type Detailed = {
        id: CustomerID
        customerNumber?: string | null
        avatar?: NixFile.NixImage
        externalId?: string | null
        displayName?: string | null
        personalDetail?: PersonalDetail | null
        businessDetail?: BusinessDetail | null
        status?: CustomerStatus | null
        type?: CustomerType | null
        lifecycleStage?: CustomerLifecycleStage | null
        contact?: Contact | null
        billingAddress?: Address | null
        shippingAddress?: Address | null
        language?: string | null
        timezone?: string | null
        tags?: TagModel.Tag[] | null
        segments?: CustomerSegment[] | null
        storageID?: string | number | null
        entityID: NixID
        audit?: AuditSection | null
    }

    export type Create = {
        externalId?: string
        displayName?: string
        personalDetail?: PersonalDetail
        businessDetail?: BusinessDetail
        type?: CustomerType
        lifecycleStage?: CustomerLifecycleStage
        language?: string
        timezone?: string
        contact?: Contact
        billingAddress?: Address
        shippingAddress?: Address
        preferences?: Preferences
        tags?: string[]
        segmentIds?: string[]
    }

    export type SelfCreate = {
        displayName?: string
        personalDetail?: PersonalDetail
        language?: string
        contact?: SelfContact
        billingAddress?: CreateAddress
        sameAsBillingAddress?: boolean
        shippingAddress?: CreateAddress
        preferences?: Preferences
        email: string
        password: string
    }

    export type SelfCreateRequest = {
        data: SelfCreate
        avatar?: File | null
    }

    export type Update = Create & {
        status?: CustomerStatus
    }

    export type RangedQuery<T> = {
        start?: T
        end?: T
        value?: T
    }

    export type PersonalDetailQuery = {
        firstName?: string
        middleName?: string
        lastName?: string
        title?: string
        gender?: string
        dateOfBirth?: RangedQuery<string>
        nationality?: string
        passportNumber?: string
        nationalID?: string
        maritalStatus?: string
        mothersMaidenName?: string
        countryOfBirth?: string
        profession?: string
    }

    export type BusinessDetailQuery = {
        companyName?: string
        registrationNumber?: string
        taxID?: string
        industry?: string
        companySize?: RangedQuery<number>
        businessType?: string
        legalForm?: string
        registrationDate?: RangedQuery<string>
    }

    export type ContactQuery = {
        email?: string
        secondaryEmail?: string
        phoneNumber?: string
        mobileNumber?: string
        faxNumber?: string
        website?: string
    }

    export type AddressQuery = {
        id?: string
        label?: string
        line1?: string
        line2?: string
        city?: string
        state?: string
        province?: string
        postalCode?: string
        country?: string
        latitude?: RangedQuery<number>
        longitude?: RangedQuery<number>
    }

    export type AuditQuery = {
        createdBy?: NixID
        createdDate?: RangedQuery<string>
        modifiedDate?: RangedQuery<string>
    }

    export type Query = PagedRequest<{
        id?: NixID
        customerNumber?: string
        externalId?: string
        personalDetail?: PersonalDetailQuery
        businessDetail?: BusinessDetailQuery
        status?: CustomerStatus
        type?: CustomerType
        lifecycleStage?: CustomerLifecycleStage
        contact?: ContactQuery
        billingAddress?: AddressQuery
        shippingAddress?: AddressQuery
        language?: string
        timezone?: string
        tags?: string[]
        segments?: string[]
        entityID?: NixID
        audit?: AuditQuery
        show?: ObjectVisibility
    }>
}
