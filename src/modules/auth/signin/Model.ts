import type {NixID} from "@/models/Models.ts";

export namespace LoginModels {
    type WithPassword = {
        password: string;
    }
    export type EmailAndPassword = {
        email: string
        orgID?: number
    } & WithPassword
    export type PhoneAndPassword = {
        phone: string
        orgID?: number
    } & WithPassword

    export type LoginResponse = {
        "accessToken": string,
        "refreshToken": string
        "tokenType": string
        "orgID"?: NixID
    }
    export type ResendVerificationRequest = {
        email: string,
        orgID?: NixID
    }
    export type VerifyEmailRequest = {
        email: string
        token: number
        orgID?: NixID
    }
}