import {type OrganizationModel} from "../models/models.ts";
import {BACKEND} from "../../utils";
import type {Paged} from "@suiteonix/models";

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