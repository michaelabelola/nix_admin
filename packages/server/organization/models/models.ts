import type {NixID} from "@suiteonix/models";
import type {Auditable} from "@suiteonix/models";
import type {Ownable, PagedRequest} from "@suiteonix/models";
import type {LocationModel} from "../../location/Models.ts";

export namespace OrganizationModel {
    export type OrgID = NixID
    export type Organization = {
        id: string
        name: string
        shortName: string
        industry: string
        isApproved: boolean
        isSuspended: boolean
        logo: string
        logoDark: string
        coverImage: string
        coverImageDark: string
        entityID: NixID
    }
    type Details = {
        about: string
        dateEstablished: Date | string //2026-02-26,
        registrationNumber: string
        registrationCountry: string
        verified: boolean
        approved: boolean
        suspended: boolean
    }
    type Logos = {
        logo: string
        logoDark: string
        coverImage: string
        coverImageDark: string
    }
    type Socials = {
        website: string
        facebook: string
        twitter: string
        instagram: string
        linkedin: string
        youtube: string
        snapchat: string
        pinterest: string
    }
    type Contact = {

        email: string
        phone: string
    }
    export type Detailed = {
        id: string
        name: string
        shortName: string
        industry: string
        details: Details
        address: LocationModel.Address
        logos: Logos
        registeredBy: string
        socials: Socials
        contact: Contact
        audit: Auditable
    } & Auditable & Ownable

    type QueryMain = PagedRequest<{
        "query": string
        "id": NixID
        "name": string
        "shortName": string
        "industry": string
        "dateEstablished": string //"2026-02-26",
        "registrationNumber": string
        "registrationCountry": string
        "verified": boolean
        "approved": boolean
        "suspended": boolean
        "isApproved": boolean
    }>
    export type Query = QueryMain
    // export type Query = Pick<QueryMain, "query">
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
    export type Register = {
        name: string
        shortName: string
        industry: string
        bio?: string
        detail: {
            about?: string
            dateEstablished?: string// 2026-02-26,
            registrationNumber?: string
            registrationCountry: string
        },
        address: {
            apt_number?: string
            street: string
            city: string
            state: string
            country: string
            zipcode: string
            latitude: number
            longitude: number
        },
        socials: {
            website: string
            facebook: string
            twitter: string
            instagram: string
            linkedin: string
            youtube: string
            snapchat: string
            pinterest: string
        }
        contact: {
            email: string
            phone: string
        }
    }
}
