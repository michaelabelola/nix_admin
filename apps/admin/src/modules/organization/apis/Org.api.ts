import {type OrganizationModel} from "#/modules/organization/models/models.ts";
import {BACKEND} from "#/lib/fetch.ts";
import type {Paged} from "#/models/PagedModel.ts";

export class OrgApi {

    getById(orgId: OrganizationModel.OrgID) {
        if (!orgId) return Promise.reject("Organization ID is required");
        return BACKEND.authFetch<OrganizationModel.Organization>(`/organizations/${orgId}`)
    }

    query(params?: OrganizationModel.Query) {
        return BACKEND.authFetch<Paged<OrganizationModel.Organization>>(
            `/organizations/query`,
            {query: params}
        )
    }
}

const orgApi = new OrgApi();

export default orgApi;