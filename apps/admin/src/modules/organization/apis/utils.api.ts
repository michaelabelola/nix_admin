import {type OrganizationUtils} from "#/modules/organization/models/util.models.ts";
import {BACKEND} from "#/lib/fetch.ts";

class OrganizationUtilsApi {
    getAllIndustries() {
        return BACKEND.authFetch<OrganizationUtils.Industries>(`/organizations/utils/industries`)
    }
}

const organizationUtilsApi = new OrganizationUtilsApi()
export default organizationUtilsApi