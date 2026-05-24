import type {Audit_RangedQuery, AuditSection, NixFile, NixID, ObjectVisibility, PagedRequest} from "@suiteonix/models";

import type {OrganizationModel} from "./models.ts";

export namespace OrgProfileModel {
    export type OrgID = OrganizationModel.OrgID
    export type OrgIDRef = OrgID | { id: OrgID }
    export type FileRef = NixFile.NixImage | null

    export type ListingLocation = {
        apt_number?: string | null
        street?: string | null
        city?: string | null
        state?: string | null
        country?: string | null
        zipcode?: string | null
        lat?: number | null
        lng?: number | null
        distance?: number | null
    }

    export type ListingLocationQuery = {
        apt_number?: string
        street?: string
        city?: string
        state?: string
        country?: string
        zipcode?: string
        lat?: number
        lng?: number
        withinRadiusInMeters?: number
        nearest?: boolean
    }

    export type OrgProfile = {
        id: OrgIDRef
        name: string
        shortName: string
        industry: string
        approved: boolean
        logo: FileRef
        coverImage: FileRef
        entityID: NixID
    }

    export type Detailed = {
        id: OrgIDRef
        name: string
        shortName: string
        industry: string
        entityID: NixID
        email?: string | null
        phone?: string | null
        about?: string | null
        dateEstablished?: string | null
        verified: boolean
        approved: boolean
        suspended: boolean
        logo: FileRef
        coverImage: FileRef
        contacts: OrganizationModel.Contact[]
        socials: OrganizationModel.SocialAccount[]
        location?: ListingLocation | null
    }

    export type Create = Omit<Detailed, "location"> & {
        avatar?: FileRef
    }

    export type Query = PagedRequest<{
        query: string
        id: OrgID
        name: string
        shortName: string
        industry: string
        isApproved: boolean
        hasLogo: boolean
        hasCoverImage: boolean
        location: ListingLocationQuery
        entityID: NixID
        audit: Audit_RangedQuery
        show: ObjectVisibility
    }>

    export type DetailedWithAudit = Detailed & {
        audit?: AuditSection | null
    }
}
