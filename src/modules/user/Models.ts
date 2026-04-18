import type {AuditSection, NixID} from "@/models/Models.ts";

export namespace UserModel {

    export type UserID = NixID
    export type UserIDs = UserID[]

    export type User = {
        id: string,
        firstname: string
        lastname: string
        avatar: string
        entityID: NixID
    }
    export type DetailedUser = {
        id: UserID,
        firstname: string
        lastname: string
        email: string
        phone: string
        dateOfBirth: string,
        avatar: string,
        bio: string,
        address: LocationModel.Address,
        entityID: NixID,
        audit: AuditSection
    }
}

