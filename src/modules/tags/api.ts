import {Backend, type RequestHelperInit} from "#/lib/fetch.ts";
import type {ResponseDto} from "#/models/Models.ts";
import type {Paged} from "#/models/PagedModel.ts";
import type {TagModel} from "#/modules/tags/model.ts";

class TagApi {
    query(params?: TagModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<TagModel.Tag>>("/tags/query", {query: params, ...init})
    }

    fullTextSearch(params?: TagModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<TagModel.Tag>>("/tags/fts", {query: params, ...init})
    }

    getById(tagId: TagModel.TagID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<TagModel.Tag>(`/tag/${tagId}`, init)
    }

    getByIdsBatch(ids: TagModel.TagID[], init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<TagModel.Tag[]>("/tags/batch", {
            method: "POST",
            body: ids,
            ...init,
        })
    }

    create(body: TagModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<TagModel.Tag>("/tag", {
            method: "POST",
            body,
            ...init,
        })
    }

    update(tagId: TagModel.TagID, body: TagModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<TagModel.Tag>(`/tag/${tagId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    delete(tagId: TagModel.TagID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/tag/${tagId}`, {
            method: "DELETE",
            ...init,
        })
    }
}

const tagApi = new TagApi()
export default tagApi
