import {AuthProfileModel} from "./Models.ts";
import {BACKEND} from "../utils";

class AuthProfileApi {

    getMyProfile() {
        return BACKEND.authFetch<AuthProfileModel.AuthProfile>(`/auth/profile/me`)
    }

}


const authProfileApi = new AuthProfileApi()

export default authProfileApi;