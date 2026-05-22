import {Backend, type RequestHelperInit} from "#/lib/fetch.ts";
import type {ResponseDto} from "#/models/Models.ts";
import type {Paged} from "#/models/PagedModel.ts";
import type {AccessTokenModel} from "#/modules/access-token/model.ts";

class AccessTokenApi {
    create(body: AccessTokenModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<AccessTokenModel.Created>("/access-token", {
            method: "POST",
            body,
            ...init,
        })
    }

    getById(accessTokenId: AccessTokenModel.AccessTokenID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<AccessTokenModel.Detailed>(`/access-token/${accessTokenId}`, init)
    }

    query(params?: AccessTokenModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<AccessTokenModel.AccessToken>>("/access-tokens/query", {
            query: params,
            ...init,
        })
    }

    fullTextSearch(params?: AccessTokenModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<AccessTokenModel.AccessToken>>("/access-tokens/fts", {
            query: params,
            ...init,
        })
    }

    deactivate(accessTokenId: AccessTokenModel.AccessTokenID, body?: AccessTokenModel.Deactivate, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<AccessTokenModel.Detailed>(`/access-token/${accessTokenId}/deactivate`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    changeStatus(accessTokenId: AccessTokenModel.AccessTokenID, body: AccessTokenModel.ChangeStatus, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<AccessTokenModel.Detailed>(`/access-token/${accessTokenId}/status`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    delete(accessTokenId: AccessTokenModel.AccessTokenID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/access-token/${accessTokenId}`, {
            method: "DELETE",
            ...init,
        })
    }
}

const accessTokenApi = new AccessTokenApi()
export default accessTokenApi
