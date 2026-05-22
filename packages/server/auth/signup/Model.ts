import {type LocationModel, type UserModel, AuthProfileModel, type PermissionModel} from "@suiteonix/server";

export namespace SignUpModel {
    export type Request = {
        email: string
        phone: string
        password: string
        firstname: string
        lastname: string
        dateOfBirth: string //2026-02-26
        bio: string //longtext
        address: LocationModel.Address
    }
    export type Response = {
        auth: AuthProfileModel.AuthProfile,
        user: UserModel.DetailedUser,
        permissions: PermissionModel.Permission[]
    }
}
