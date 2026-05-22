import {type UserModel} from "#/modules/user/Models.ts";
import {BACKEND} from "#/lib/fetch.ts";
import type {FetchError} from "#/lib/request.types.tsx";

class UserApi {

    getUserByID(id: UserModel.UserID) {
        if (!id) return Promise.reject({
            message: "User Id not provided",
            _internal: {
                status: "00",
                statusText: "XX"
            }
        } as unknown as FetchError)
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