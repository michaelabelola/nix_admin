import {type LoginModel} from "#/modules/auth/signin/Model.ts";
import {BACKEND} from "#/lib/fetch.ts";
import type {NixID, ResponseDto} from "#/models/Models.ts";
import {AuthProfileModel} from "#/modules/Models.ts";


class LoginApi {
    emailPasswordLogin({body, ...rest}: BACKEND.Req<LoginModel.EmailAndPassword>) {
        return BACKEND.apiFetch<LoginModel.LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(body),
            ...rest
        })
    }

    proxyLogin(init: BACKEND.Req<undefined, { userId: NixID, orgId: NixID }>) {
        return BACKEND.apiFetch<LoginModel.LoginResponse>(`/auth/login/proxy`, init)
    }

    resendVerificationEmail({body, ...params}: BACKEND.Req<LoginModel.ResendVerificationRequest>) {
        return BACKEND.apiFetch<any>(`/auth/resend-verification`, {...params, body: JSON.stringify(body)})
    }

    verifyEmail(params: BACKEND.Req<LoginModel.VerifyEmailRequest>) {
        return BACKEND.apiFetch<ResponseDto<AuthProfileModel.AuthProfile>>(`/auth/verify-email`, params)
    }
}

export const loginApi = new LoginApi()