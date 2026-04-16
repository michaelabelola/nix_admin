import {type NixID, NixRole} from "@/models/Models.ts";

export namespace AuthProfileModel {
    export enum ConfigFlag {
        ACTIVE = "ACTIVE",
        INACTIVE = "INACTIVE",
        DISABLED = "DISABLED"
    }

    export type AuthProfile = {
        id: NixID,
        role: NixRole
        email: string
        phone: string
        entityID: NixID,
        signInOptions: {
            emailAndPassword: ConfigFlag
            emailAndEmailToken: ConfigFlag
            phoneAndPassword: ConfigFlag
            phoneAndPhoneToken: ConfigFlag
        },
        configFlags: {
            jwtAuthEnabled: ConfigFlag
            linkedAccountLogin: ConfigFlag
            generateRandomPassword: ConfigFlag
            forwardPasswordToMail: ConfigFlag
            requirePasswordChange: ConfigFlag
            sendMailVerification: ConfigFlag
            enableOwnerLogin: ConfigFlag
        }
    }
}