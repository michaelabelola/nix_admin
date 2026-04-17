import {AuthProfileModel} from "#/modules/Models.ts";
import {type UserModel} from "#/modules/user/Models.ts";
import {type PermissionModel} from "#/modules/permissions/Models.ts";

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