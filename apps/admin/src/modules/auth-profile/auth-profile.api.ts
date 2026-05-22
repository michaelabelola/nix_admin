import {AuthProfileModel} from "#/modules/auth-profile/Models.ts";
import {BACKEND} from "#/lib/fetch.ts";

class AuthProfileApi {

    getMyProfile() {
        return BACKEND.authFetch<AuthProfileModel.AuthProfile>(`/auth/profile/me`)
    }

}


const authProfileApi = new AuthProfileApi()

export default authProfileApi;