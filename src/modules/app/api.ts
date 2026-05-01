import {Backend, type RequestHelperInit} from "#/lib/fetch.ts";
import type {ResponseDto} from "#/models/Models.ts";
import type {Paged} from "#/models/PagedModel.ts";
import {PageUtil} from "#/models/PagedModel.ts";
import type {AppModel} from "#/modules/app/model.ts";

class AppApi {
    create(body: AppModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<AppModel.Created>("/app", {
            method: "POST",
            body,
            ...init,
        })
    }

    getById(appId: AppModel.AppID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<AppModel.Detailed>(`/app/${appId}`, init)
    }

    query(params?: AppModel.Query, init?: Partial<RequestHelperInit>) {
        const query = buildAppQuery(params)
        return Backend.authRequest<Paged<AppModel.App>>(`/apps/query?${query.toString()}`, init)
    }

    fullTextSearch(params?: AppModel.Query, init?: Partial<RequestHelperInit>) {
        const query = buildAppQuery(params)
        return Backend.authRequest<Paged<AppModel.App>>(`/apps/fts?${query.toString()}`, init)
    }

    update(appId: AppModel.AppID, body: AppModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<AppModel.Detailed>(`/app/${appId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    delete(appId: AppModel.AppID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/app/${appId}`, {
            method: "DELETE",
            ...init,
        })
    }
}

const appApi = new AppApi()
export default appApi

const appendIfDefined = (query: URLSearchParams, key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return
    query.append(key, String(value))
}

const buildAppQuery = (params?: AppModel.Query) => {
    const query = PageUtil.appendRequestToParam(params)
    if (!params) return query

    appendIfDefined(query, "id", params.id)
    appendIfDefined(query, "name", params.name)
    appendIfDefined(query, "about", params.about)
    appendIfDefined(query, "description", params.description)
    params.tags?.forEach((tag) => appendIfDefined(query, "tags", tag))

    return query
}
