import {type OrganizationUtils} from "../models/util.models.ts";
import {BACKEND} from "../../utils";

class OrganizationUtilsApi {
    getAllIndustries() {
        return BACKEND.authFetch<OrganizationUtils.Industries>(`/organizations/utils/industries`)
    }
}

const organizationUtilsApi = new OrganizationUtilsApi()
export default organizationUtilsApi