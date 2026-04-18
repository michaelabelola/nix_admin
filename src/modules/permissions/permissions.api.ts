import {type Paged, type PagedRequest} from "@/models/PagedModel.ts";
import {type UserModel} from "@/modules/user/Models.ts";
import {BACKEND} from "#/lib/fetch.ts";
import {type PermissionModel} from "#/modules/permissions/Models.ts";

class PermissionsApi {

    getMyLoginAndProxyLoginAccesses(req?: BACKEND.ReqQuery<PagedRequest<any>>) {
        return BACKEND.authFetch<Paged<PermissionModel.Permission>>(`/permissions/me/query/login_and_proxy_login_accesses`, req)
    }

    queryProxyLoginAccesses(req?: BACKEND.ReqQuery<PagedRequest<any>>) {
        return BACKEND.authFetch<Paged<PermissionModel.Permission>>(`/permissions/me/query/proxy_login_access`, req)
    }

    getAccountsICanLoginToByOrganizationId(req ?: { orgID: string }) {
        return BACKEND.authFetch<UserModel.UserIDs>(`/permissions/me/entity/${req?.orgID}/get_proxy_accounts`)
    }
}

const permissionsAPI = new PermissionsApi();
export default permissionsAPI;