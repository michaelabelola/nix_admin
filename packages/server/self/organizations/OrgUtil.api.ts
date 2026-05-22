import {type OrganizationUtilModel} from "./org.util.model.tsx";
import {BACKEND} from "../../utils";


class OrganizationUtilsApi {
    getAllIndustries() {
        return BACKEND.authFetch<OrganizationUtilModel.Industries>(`/organizations/utils/industries`)
    }
}

const organizationUtilsApi = new OrganizationUtilsApi()
export default organizationUtilsApi