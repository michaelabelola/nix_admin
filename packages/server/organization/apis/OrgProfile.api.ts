import {type PageSlice, PageUtil, type Paged} from "@suiteonix/models";

import {Backend, type RequestHelperInit} from "../../utils";
import type {OrgProfileModel} from "../models";

export class OrgProfileApi {
    getDetailedById(orgID: OrgProfileModel.OrgID, init?: Partial<RequestHelperInit>) {
        if (!orgID) return Promise.reject("Organization ID is required");
        return Backend.authRequest<OrgProfileModel.Detailed>(`/organizations/${orgID}/profile/detailed`, init)
    }

    getById(orgID: OrgProfileModel.OrgID, init?: Partial<RequestHelperInit>) {
        if (!orgID) return Promise.reject("Organization ID is required");
        return Backend.authRequest<OrgProfileModel.OrgProfile>(`/organizations/${orgID}/profile`, init)
    }

    query(params?: OrgProfileModel.Query, init?: Partial<RequestHelperInit>) {
        const query = buildOrgProfileQuery(params)

        return Backend.authRequest<Paged<OrgProfileModel.OrgProfile>>(
            `/organizations/profiles?${query.toString()}`,
            init,
        )
    }

    querySlice(params?: OrgProfileModel.Query, init?: Partial<RequestHelperInit>) {
        const query = buildOrgProfileQuery(params)

        return Backend.authRequest<PageSlice<OrgProfileModel.OrgProfile>>(
            `/organizations/profiles/slice?${query.toString()}`,
            init,
        )
    }
}

const orgProfileApi = new OrgProfileApi()

export default orgProfileApi

const appendIfDefined = (query: URLSearchParams, key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return
    query.append(key, String(value))
}

const appendRange = <T,>(query: URLSearchParams, key: string, range?: { start?: T, end?: T, value?: T }) => {
    if (!range) return
    appendIfDefined(query, `${key}.start`, range.start)
    appendIfDefined(query, `${key}.end`, range.end)
    appendIfDefined(query, `${key}.value`, range.value)
}

function buildOrgProfileQuery(params?: OrgProfileModel.Query) {
    const query = PageUtil.appendRequestToParam(params)

    if (!params) return query

    appendIfDefined(query, "id", params.id)
    appendIfDefined(query, "name", params.name)
    appendIfDefined(query, "shortName", params.shortName)
    appendIfDefined(query, "industry", params.industry)
    appendIfDefined(query, "isApproved", params.isApproved)
    appendIfDefined(query, "hasLogo", params.hasLogo)
    appendIfDefined(query, "hasCoverImage", params.hasCoverImage)
    appendIfDefined(query, "entityID", params.entityID)
    appendIfDefined(query, "show", params.show)

    if (params.location) {
        appendIfDefined(query, "location.apt_number", params.location.apt_number)
        appendIfDefined(query, "location.street", params.location.street)
        appendIfDefined(query, "location.city", params.location.city)
        appendIfDefined(query, "location.state", params.location.state)
        appendIfDefined(query, "location.country", params.location.country)
        appendIfDefined(query, "location.zipcode", params.location.zipcode)
        appendIfDefined(query, "location.lat", params.location.lat)
        appendIfDefined(query, "location.lng", params.location.lng)
        appendIfDefined(query, "location.withinRadiusInMeters", params.location.withinRadiusInMeters)
        appendIfDefined(query, "location.nearest", params.location.nearest)
    }

    if (params.audit) {
        appendIfDefined(query, "audit.createdBy", params.audit.createdBy)
        appendRange(query, "audit.createdDate", params.audit.createdDate)
        appendRange(query, "audit.modifiedDate", params.audit.modifiedDate)
    }

    return query
}
