import {type SignUpModel} from "./Model.ts";
import {BACKEND} from "../../utils";

class SignUpApi {
    signUp({body, avatar, ...others}: BACKEND.Req<{
        body: SignUpModel.Request,
        avatar?: File
    }>) {
        const formData = new FormData();
        formData.append("user", JSON.stringify(body));
        if (avatar)
            formData.append("avatar", avatar);

        return BACKEND.apiFetch<SignUpModel.Response>(`/user/onboard`, {
            body: formData,
            contentType: "omit",
            method: 'POST',
            ...others
        })
    }
}

const signUpApi = new SignUpApi();
export default signUpApi;
