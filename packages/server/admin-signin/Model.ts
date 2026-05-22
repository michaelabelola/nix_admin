import type {NixID} from "../models";

export namespace LoginModel {
    type WithPassword = {
        password: string;
    }
    export type EmailAndPassword = {
        email: string
        orgID?: NixID
    } & WithPassword
    export type PhoneAndPassword = {
        phone: string
        orgID?: NixID
    } & WithPassword

    export type LoginResponse = {
        "accessToken": string,
        "refreshToken": string
        "tokenType": string
        "orgID"?: NixID
        userID: NixID
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
