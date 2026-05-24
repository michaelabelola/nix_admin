import type {AuditSection, NixFile, NixID, Ownable, PagedRequest} from "@suiteonix/models";
import type {LocationModel} from "../../location/Models.ts";

export namespace OrganizationModel {
    export type OrgID = NixID
    export type FileRef = NixFile.NixImage | null

    export enum ContactMethod {
        EMAIL = "EMAIL",
        PHONE = "PHONE",
        WHATSAPP = "WHATSAPP",
    }

    export enum LifecycleStatus {
        ACTIVE = "ACTIVE",
        INACTIVE = "INACTIVE",
        DELETED = "DELETED",
        ARCHIVED = "ARCHIVED",
    }

    export enum OrganizationStatusValue {
        ACTIVE = "ACTIVE",
        INACTIVE = "INACTIVE",
        SUSPENDED = "SUSPENDED",
        DELETED = "DELETED",
        BANNED = "BANNED",
    }

    export type Contact = {
        method: ContactMethod
        value: string
        lifecycleStatus?: LifecycleStatus | null
    }

    export type ContactUpdate = {
        id: string
        value: string
    }

    export type SocialAccount = {
        id?: string | null
        name: string
        value: string
        lifecycleStatus?: LifecycleStatus | null
    }

    export type SocialAccountUpdate = {
        id: string
        value: string
    }

    export type OrganizationStatus = {
        value: OrganizationStatusValue
        reason?: string | null
        date?: string | null
    }

    export type Organization = {
        id: string
        name: string
        shortName: string
        industry: string
        isApproved: boolean
        isSuspended: boolean
        logo: FileRef
        coverImage: FileRef
        entityID: NixID
    }

    export type Details = {
        about?: string | null
        dateEstablished?: Date | string | null
        registrationNumber?: string | null
        registrationCountry?: string | null
        verified?: boolean | null
        approved?: boolean | null
        suspended?: boolean | null
    }

    export type Detailed = {
        id: string
        name: string
        shortName: string
        industry: string
        details: Details
        address: LocationModel.Address | null
        logo: FileRef
        coverImage: FileRef
        email?: string | null
        phone?: string | null
        socials: SocialAccount[]
        contacts: Contact[]
        registeredBy?: NixID | null
        registeredBy_id?: NixID | null
        status: OrganizationStatus
        audit: AuditSection
        entityID: NixID
    } & Ownable

    export type CreateDetails = {
        about?: string | null
        dateEstablished?: string | null
        registrationNumber?: string | null
        registrationCountry?: string | null
    }

    export type Create = {
        name: string
        shortName: string
        industry: string
        bio: string
        detail: CreateDetails
        address: LocationModel.Address
        email: string
        phone: string
        socials?: SocialAccount[]
        contacts?: Contact[]
    }

    export type Update = Partial<Omit<Create, "detail"> & {
        detail: Details
    }>

    export type QueryDetails = {
        dateEstablished?: string
        registrationNumber?: string
        registrationCountry?: string
        verified?: boolean
        approved?: boolean
        suspended?: boolean
    }

    export type Query = PagedRequest<{
        query: string
        id: NixID
        name: string
        shortName: string
        industry: string
        detail: QueryDetails
        isApproved: boolean
        email: string
        phone: string
    }>

    export type ChangeStatusRequest = {
        status: OrganizationStatusValue
        reason?: string | null
    }
}

export namespace Organization_RegisterModel {
    export type OrgUser = {
        "firstname": string
        "lastname": string
        "email": string
        "phone": string
        "dateOfBirth": Date | string //"2026-02-27",
        "bio": string,
        "address": {
            "apt_number": string
            "street": string
            "city": string
            "state": string
            "country": string
            "zipcode": string
            "latitude": number
            "longitude": number
        }
    }
    export type Register = OrganizationModel.Create
    export type RegistrationResponse = {
        org: OrganizationModel.Organization
        user: unknown
        auth: unknown
        role: unknown
    }
}
