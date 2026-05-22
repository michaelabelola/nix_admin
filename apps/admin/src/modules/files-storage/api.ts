import {Backend, type RequestHelperInit} from "#/lib/fetch.ts";
import type {ResponseDto} from "#/models/Models.ts";
import type {PageRequest, Paged} from "#/models/PagedModel.ts";
import type {FilesStorageModel} from "./model.ts";

function appendFormValue(formData: FormData, key: string, value: string | boolean | undefined | null) {
    if (value == null) return;
    formData.append(key, String(value));
}

function buildCreateStorageFormData(body: FilesStorageModel.Create) {
    const formData = new FormData();
    formData.append("name", body.name);
    appendFormValue(formData, "description", body.description);
    appendFormValue(formData, "module", body.module);
    appendFormValue(formData, "isPublic", body.isPublic);
    if (body.coverImage) formData.append("coverImage", body.coverImage);
    return formData;
}

function buildUploadFileFormData(body: FilesStorageModel.UploadFile) {
    const formData = new FormData();
    formData.append(
        "data",
        new Blob(
            [
                JSON.stringify({
                    name: body.name,
                    description: body.description ?? null,
                    listableStatus: body.listableStatus ?? null,
                }),
            ],
            {type: "application/json"},
        ),
    );
    if (body.file) formData.append("file", body.file);
    return formData;
}

function buildUpdateFileFormData(body: FilesStorageModel.UpdateFile) {
    const formData = new FormData();
    appendFormValue(formData, "name", body.name);
    appendFormValue(formData, "description", body.description);
    if (body.file) formData.append("file", body.file);
    return formData;
}

class FilesStorageApi {
    query(params?: FilesStorageModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<FilesStorageModel.FilesStorage>>("/files-storages", {
            query: params,
            ...init,
        });
    }

    fullTextSearch(params?: FilesStorageModel.FullTextSearchQuery, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<FilesStorageModel.FilesStorage>>("/files-storages/fts", {
            query: params,
            ...init,
        });
    }

    getById(storageId: FilesStorageModel.FilesStorageID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<FilesStorageModel.Detailed>(`/files-storage/${storageId}`, init);
    }

    create(body: FilesStorageModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<FilesStorageModel.FilesStorage>("/files-storage", {
            method: "POST",
            body: buildCreateStorageFormData(body),
            contentType: "omit",
            ...init,
        });
    }

    update(storageId: FilesStorageModel.FilesStorageID, body: FilesStorageModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<FilesStorageModel.FilesStorage>(`/files-storage/${storageId}`, {
            method: "PATCH",
            body,
            ...init,
        });
    }

    delete(storageId: FilesStorageModel.FilesStorageID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/files-storage/${storageId}`, {
            method: "DELETE",
            ...init,
        });
    }

    listFiles(storageId: FilesStorageModel.FilesStorageID, params?: PageRequest, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<FilesStorageModel.FileItem>>(`/files-storage/${storageId}/files`, {
            query: params,
            ...init,
        });
    }

    getStorageFile(storageId: FilesStorageModel.FilesStorageID, itemId: FilesStorageModel.FileID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<FilesStorageModel.FileItem>(`/files-storage/${storageId}/files/${itemId}`, init);
    }

    getFile(itemId: FilesStorageModel.FileID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<FilesStorageModel.FileItem>(`/files/${itemId}`, init);
    }

    addFile(storageId: FilesStorageModel.FilesStorageID, body: FilesStorageModel.UploadFile, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<FilesStorageModel.FileItem>(`/files-storage/${storageId}/files`, {
            method: "POST",
            body: buildUploadFileFormData(body),
            contentType: "omit",
            ...init,
        });
    }

    updateStorageFile(
        storageId: FilesStorageModel.FilesStorageID,
        itemId: FilesStorageModel.FileID,
        body: FilesStorageModel.UpdateFile,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<FilesStorageModel.FileItem>(`/files-storage/${storageId}/files/${itemId}`, {
            method: "PATCH",
            body: buildUpdateFileFormData(body),
            contentType: "omit",
            ...init,
        });
    }

    updateFile(itemId: FilesStorageModel.FileID, body: FilesStorageModel.UpdateFile, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<FilesStorageModel.FileItem>(`/files/${itemId}`, {
            method: "PATCH",
            body: buildUpdateFileFormData(body),
            contentType: "omit",
            ...init,
        });
    }

    deleteStorageFile(storageId: FilesStorageModel.FilesStorageID, itemId: FilesStorageModel.FileID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/files-storage/${storageId}/files/${itemId}`, {
            method: "DELETE",
            ...init,
        });
    }

    deleteFile(itemId: FilesStorageModel.FileID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/files/${itemId}`, {
            method: "DELETE",
            ...init,
        });
    }

    setFileListableStatus(itemId: FilesStorageModel.FileID, body: FilesStorageModel.UpdateListableStatus, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<FilesStorageModel.FileItem>(`/files/${itemId}/listable-status`, {
            method: "PATCH",
            body,
            ...init,
        });
    }

    getTypes(init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<string[]>("/files-storage-utils/types", init);
    }
}

const filesStorageApi = new FilesStorageApi();
export default filesStorageApi;
