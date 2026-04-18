import {type UserModel} from "@/modules/user/Models.ts";
import {BACKEND} from "#/lib/fetch.ts";

class UserApi {

    getUserByID(id: UserModel.UserID) {
        return BACKEND.authFetch<UserModel.User>(`/user/${id}`)
    }

    getUserDetailed(id: UserModel.UserID) {
        return BACKEND.authFetch<UserModel.DetailedUser>(`/user/${id}/detailed`)
    }

    getMe() {
        return BACKEND.authFetch<UserModel.DetailedUser>(`/user/me`, {})
    }
}

const userAPI = new UserApi();
export default userAPI;