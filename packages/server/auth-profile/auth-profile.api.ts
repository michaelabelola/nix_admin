import {BACKEND} from "../utils/fetch.ts";
import {AuthProfileModel} from "./Models.ts";

class AuthProfileApi {

    getMyProfile() {
        return BACKEND.authFetch<AuthProfileModel.AuthProfile>(`/auth/profile/me`)
    }

}


const authProfileApi = new AuthProfileApi()

export default authProfileApi;