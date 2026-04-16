import {type LoginModel} from "#/modules/auth/signin/Model.ts";
import {BACKEND} from "#/lib/fetch.ts";


class LoginApi {
    emailPasswordLogin({body,...rest}: BACKEND.Req<LoginModel.EmailAndPassword>) {
        return BACKEND.apiFetch<LoginModel.LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(body),
            ...rest
        })
    }
}

export const loginApi = new LoginApi()