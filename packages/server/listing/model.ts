import type {AuditSection, NixID, NixModule} from "@suiteonix/models"
import type {PagedRequest} from "@suiteonix/models"

export namespace ListingModel {
    export type ListingID = string
    export type ListingProfileID = string
    export type TagID = string

    export enum ListingStatus {
        LIVE = "LIVE",
        INACTIVE = "INACTIVE",
    }

    export enum ListingType {
        DERIVED = "DERIVED",
        COMMON = "COMMON",
    }

    export type Listing = {
        id: ListingID
        title: string | null
        description: string | null
        type: string | null
        status: string | null
        module: NixModule | null
        tags: TagID[]
        entityID: NixID
    }

    export type Detailed = Listing & {
        audit?: AuditSection | null
    }

    export type Query = PagedRequest<{
        id?: ListingID
        title?: string
        description?: string
        type?: string
        status?: string
        module?: NixModule
    }>

    export type Create = {
        title: string
        description?: string | null
        type?: ListingType | string | null
        status?: ListingStatus | null
        module?: NixModule | null
        isPublic?: boolean | null
        tags?: TagID[]
    }

    export type Update = {
        title?: string | null
        description?: string | null
        type?: ListingType | string | null
        status?: ListingStatus | null
        module?: NixModule | null
        tags?: TagID[] | null
    }
}
