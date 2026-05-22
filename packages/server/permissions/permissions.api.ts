import {type Paged, type PagedRequest} from "@suiteonix/models";
import {type UserModel} from "../user/Models.ts";
import {BACKEND} from "../utils";
import {type PermissionModel} from "./Models.ts";

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