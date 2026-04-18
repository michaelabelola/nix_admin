import {type OrganizationUtilModel} from "#/modules/admin/user-admin/organizations/org.util.model.tsx";
import {BACKEND} from "#/lib/fetch.ts";


class OrganizationUtilsApi {
    getAllIndustries() {
        return BACKEND.authFetch<OrganizationUtilModel.Industries>(`/organizations/utils/industries`)
    }
}

const organizationUtilsApi = new OrganizationUtilsApi()
export default organizationUtilsApi