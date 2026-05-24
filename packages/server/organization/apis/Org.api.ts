import {type OrganizationModel} from "../models/models.ts";
import {Backend, type RequestHelperInit} from "../../utils";
import {type PageRequest, PageUtil, type Paged, type ResponseDto} from "@suiteonix/models";

export class OrgApi {

    getById(orgId: OrganizationModel.OrgID, init?: Partial<RequestHelperInit>) {
        if (!orgId) return Promise.reject("Organization ID is required");
        return Backend.authRequest<OrganizationModel.Organization>(`/organizations/${orgId}`, init)
    }

    getDetailed(orgId: OrganizationModel.OrgID, init?: Partial<RequestHelperInit>) {
        if (!orgId) return Promise.reject("Organization ID is required");
        return Backend.authRequest<OrganizationModel.Detailed>(`/organizations/${orgId}/detailed`, init)
    }

    getMeDetailed(init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<OrganizationModel.Detailed>("/organizations/me/detailed", init)
    }

    query(params?: OrganizationModel.Query, init?: Partial<RequestHelperInit>) {
        const query = buildOrganizationQuery(params)

        return Backend.authRequest<Paged<OrganizationModel.Detailed>>(
            `/organizations/query?${query.toString()}`,
            init,
        )
    }

    search(q: string, params?: PageRequest, init?: Partial<RequestHelperInit>) {
        const query = PageUtil.appendRequestToParam(params)
        appendIfDefined(query, "q", q)

        return Backend.authRequest<Paged<OrganizationModel.Organization>>(
            `/organizations/search?${query.toString()}`,
            init,
        )
    }

    updateMe(body: OrganizationModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<OrganizationModel.Detailed>("/organizations/me", {
            method: "PATCH",
            body,
            ...init,
        })
    }

    updateMeLogos(files: { logo?: File | null, coverImage?: File | null }, init?: Partial<RequestHelperInit>) {
        const formData = new FormData()
        if (files.logo) formData.append("logo", files.logo)
        if (files.coverImage) formData.append("coverImage", files.coverImage)

        return Backend.authRequest<OrganizationModel.Detailed>("/organizations/me/logos", {
            method: "PATCH",
            body: formData,
            contentType: "omit",
            ...init,
        })
    }

    deactivateMe(reason?: string | null, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<OrganizationModel.Organization>>("/organizations/me/deactivate", {
            method: "PATCH",
            query: reason ? {reason} : undefined,
            ...init,
        })
    }

    changeMeStatus(body: OrganizationModel.ChangeStatusRequest, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<OrganizationModel.Organization>>("/organizations/me/status", {
            method: "PATCH",
            body,
            ...init,
        })
    }

    deleteMe(reason?: string | null, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>("/organizations/me", {
            method: "DELETE",
            query: reason ? {reason} : undefined,
            ...init,
        })
    }
}

const orgApi = new OrgApi();

export default orgApi;

const appendIfDefined = (query: URLSearchParams, key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return
    query.append(key, String(value))
}

function buildOrganizationQuery(params?: OrganizationModel.Query) {
    const query = PageUtil.appendRequestToParam(params)

    if (!params) return query

    appendIfDefined(query, "id", params.id)
    appendIfDefined(query, "name", params.name)
    appendIfDefined(query, "shortName", params.shortName)
    appendIfDefined(query, "industry", params.industry)
    appendIfDefined(query, "isApproved", params.isApproved)
    appendIfDefined(query, "email", params.email)
    appendIfDefined(query, "phone", params.phone)

    if (params.detail) {
        appendIfDefined(query, "detail.dateEstablished", params.detail.dateEstablished)
        appendIfDefined(query, "detail.registrationNumber", params.detail.registrationNumber)
        appendIfDefined(query, "detail.registrationCountry", params.detail.registrationCountry)
        appendIfDefined(query, "detail.verified", params.detail.verified)
        appendIfDefined(query, "detail.approved", params.detail.approved)
        appendIfDefined(query, "detail.suspended", params.detail.suspended)
    }

    return query
}
