import type {LoginModel} from "./Model.ts";
import {BACKEND} from "../utils/fetch.ts";
import type {NixID, ResponseDto} from "../models";
import {AuthProfileModel} from "@suiteonix/admin/src/modules/Models.ts";

class LoginApi {
    emailPasswordLogin({body, ...rest}: BACKEND.ReqBody<LoginModel.EmailAndPassword>) {
        return BACKEND.apiFetch<LoginModel.LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(body),
            ...rest
        })
    }

    proxyLogin(init: BACKEND.ReqQuery<{ userId: NixID, orgId: NixID }>) {
        return BACKEND.authFetch<LoginModel.LoginResponse>(`/auth/login/proxy`, {
            ...init,
            method: "POST"
        })
    }

    resendVerificationEmail({body, ...params}: BACKEND.ReqBody<LoginModel.ResendVerificationRequest>) {
        return BACKEND.apiFetch<any>(`/auth/resend-verification`, {
            method: "POST",
            ...params,
            body: JSON.stringify(body)
        })
    }

    verifyEmail({body, ...params}: BACKEND.ReqBody<LoginModel.VerifyEmailRequest>) {
        return BACKEND.apiFetch<ResponseDto<AuthProfileModel.AuthProfile>>(`/auth/verify-email`,
            {
                method: "POST",
                ...params,
                body: JSON.stringify(body)
            }
        )
    }
}

export const loginApi = new LoginApi()