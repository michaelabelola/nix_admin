import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {useResponseFieldErrorHandler} from "../utils";
import {Page_EMPTY, type PageRequest} from "@suiteonix/models";
import filesStorageApi from "./api.ts";
import type {FilesStorageModel} from "./model.ts";

type SuccessHandler<T> = (data: T) => void

const root = ["files-storage"] as const
// @ts-ignore
const FilesStorageQueryKeys = {
    root: root,
    query: (query?: FilesStorageModel.Query) => [...FilesStorageQueryKeys.root, "list", query] as const,
    fts: (query?: FilesStorageModel.FullTextSearchQuery) => [...FilesStorageQueryKeys.root, "fts", query] as const,
    detail: (storageId: FilesStorageModel.FilesStorageID) => [...FilesStorageQueryKeys.root, "detail", storageId] as const,
    filesRoot: (storageId: FilesStorageModel.FilesStorageID) => [...FilesStorageQueryKeys.detail(storageId), "files"] as const,
    files: (storageId: FilesStorageModel.FilesStorageID, query?: PageRequest) =>
        [...FilesStorageQueryKeys.filesRoot(storageId), query] as const,
    storageFile: (storageId: FilesStorageModel.FilesStorageID, itemId: FilesStorageModel.FileID) =>
        [...FilesStorageQueryKeys.filesRoot(storageId), itemId] as const,
    file: (itemId: FilesStorageModel.FileID) => [...FilesStorageQueryKeys.root, "file", itemId] as const,
    types: [...root, "types"] as const,
};

export namespace FilesStorageRequest {
    export const useQueryFilesStorages = (query?: FilesStorageModel.Query) => {
        const errHandler = useResponseFieldErrorHandler();
        return {
            ...useQuery({
                queryKey: FilesStorageQueryKeys.query(query),
                queryFn: () => filesStorageApi.query(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        };
    };

    export const useQueryFilesStoragesFts = (query?: FilesStorageModel.FullTextSearchQuery) => {
        const errHandler = useResponseFieldErrorHandler();
        return {
            ...useQuery({
                queryKey: FilesStorageQueryKeys.fts(query),
                queryFn: () => filesStorageApi.fullTextSearch(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        };
    };

    export const useGetFilesStorage = (storageId?: FilesStorageModel.FilesStorageID) => {
        const errHandler = useResponseFieldErrorHandler();
        return {
            ...useQuery({
                queryKey: FilesStorageQueryKeys.detail(storageId ?? ""),
                queryFn: () => filesStorageApi.getById(storageId!, {errHandler}),
                enabled: storageId != null,
            }),
            errHandler,
        };
    };

    export const useQueryStorageFiles = (storageId?: FilesStorageModel.FilesStorageID, query?: FilesStorageModel.FileQuery) => {
        const errHandler = useResponseFieldErrorHandler();
        return {
            ...useQuery({
                queryKey: FilesStorageQueryKeys.files(storageId ?? "", query),
                queryFn: () => filesStorageApi.listFiles(storageId!, query, {errHandler}),
                enabled: storageId != null,
                initialData: Page_EMPTY,
            }),
            errHandler,
        };
    };

    export const useGetStorageFile = (storageId?: FilesStorageModel.FilesStorageID, itemId?: FilesStorageModel.FileID) => {
        const errHandler = useResponseFieldErrorHandler();
        return {
            ...useQuery({
                queryKey: FilesStorageQueryKeys.storageFile(storageId ?? "", itemId ?? ""),
                queryFn: () => filesStorageApi.getStorageFile(storageId!, itemId!, {errHandler}),
                enabled: storageId != null && itemId != null,
            }),
            errHandler,
        };
    };

    export const useGetFile = (itemId?: FilesStorageModel.FileID) => {
        const errHandler = useResponseFieldErrorHandler();
        return {
            ...useQuery({
                queryKey: FilesStorageQueryKeys.file(itemId ?? ""),
                queryFn: () => filesStorageApi.getFile(itemId!, {errHandler}),
                enabled: itemId != null,
            }),
            errHandler,
        };
    };

    export const useQueryFilesStorageTypes = () => {
        const errHandler = useResponseFieldErrorHandler();
        return {
            ...useQuery({
                queryKey: FilesStorageQueryKeys.types,
                queryFn: () => filesStorageApi.getTypes({errHandler}),
                initialData: [],
            }),
            errHandler,
        };
    };

    export function useCreateFilesStorage(successHandler?: SuccessHandler<FilesStorageModel.FilesStorage>) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: (body: FilesStorageModel.Create) => filesStorageApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.root});
                    successHandler?.(data);
                },
            }),
            errHandler,
        };
    }

    export function useUpdateFilesStorage(successHandler?: SuccessHandler<FilesStorageModel.FilesStorage>) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: ({storageId, body}: {
                    storageId: FilesStorageModel.FilesStorageID,
                    body: FilesStorageModel.Update
                }) =>
                    filesStorageApi.update(storageId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.detail(variables.storageId)}),
                    ]);
                    successHandler?.(data);
                },
            }),
            errHandler,
        };
    }

    export function useDeleteFilesStorage(successHandler?: () => void) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: (storageId: FilesStorageModel.FilesStorageID) => filesStorageApi.delete(storageId, {errHandler}),
                onSuccess: async (_data, storageId) => {
                    await queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.root});
                    await queryClient.removeQueries({queryKey: FilesStorageQueryKeys.detail(storageId)});
                    successHandler?.();
                },
            }),
            errHandler,
        };
    }

    export function useAddStorageFile(successHandler?: SuccessHandler<FilesStorageModel.FileItem>) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: ({storageId, body}: {
                    storageId: FilesStorageModel.FilesStorageID,
                    body: FilesStorageModel.UploadFile
                }) =>
                    filesStorageApi.addFile(storageId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.detail(variables.storageId)}),
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.filesRoot(variables.storageId)}),
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.root}),
                    ]);
                    queryClient.setQueryData(FilesStorageQueryKeys.file(data.id), data);
                    successHandler?.(data);
                },
            }),
            errHandler,
        };
    }

    export function useUpdateStorageFile(successHandler?: SuccessHandler<FilesStorageModel.FileItem>) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: ({storageId, itemId, body}: {
                    storageId: FilesStorageModel.FilesStorageID,
                    itemId: FilesStorageModel.FileID,
                    body: FilesStorageModel.UpdateFile
                }) => filesStorageApi.updateStorageFile(storageId, itemId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.detail(variables.storageId)}),
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.filesRoot(variables.storageId)}),
                    ]);
                    queryClient.setQueryData(FilesStorageQueryKeys.storageFile(variables.storageId, variables.itemId), data);
                    queryClient.setQueryData(FilesStorageQueryKeys.file(variables.itemId), data);
                    successHandler?.(data);
                },
            }),
            errHandler,
        };
    }

    export function useUpdateFile(successHandler?: SuccessHandler<FilesStorageModel.FileItem>) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: ({itemId, body}: {
                    itemId: FilesStorageModel.FileID,
                    body: FilesStorageModel.UpdateFile
                }) =>
                    filesStorageApi.updateFile(itemId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.root});
                    queryClient.setQueryData(FilesStorageQueryKeys.file(variables.itemId), data);
                    successHandler?.(data);
                },
            }),
            errHandler,
        };
    }

    export function useDeleteStorageFile(successHandler?: () => void) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: ({storageId, itemId}: {
                    storageId: FilesStorageModel.FilesStorageID,
                    itemId: FilesStorageModel.FileID
                }) =>
                    filesStorageApi.deleteStorageFile(storageId, itemId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.detail(variables.storageId)}),
                        queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.filesRoot(variables.storageId)}),
                    ]);
                    await Promise.all([
                        queryClient.removeQueries({queryKey: FilesStorageQueryKeys.storageFile(variables.storageId, variables.itemId)}),
                        queryClient.removeQueries({queryKey: FilesStorageQueryKeys.file(variables.itemId)}),
                    ]);
                    successHandler?.();
                },
            }),
            errHandler,
        };
    }

    export function useDeleteFile(successHandler?: () => void) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: (itemId: FilesStorageModel.FileID) => filesStorageApi.deleteFile(itemId, {errHandler}),
                onSuccess: async (_data, itemId) => {
                    await queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.root});
                    await queryClient.removeQueries({queryKey: FilesStorageQueryKeys.file(itemId)});
                    successHandler?.();
                },
            }),
            errHandler,
        };
    }

    export function useSetFileListableStatus(successHandler?: SuccessHandler<FilesStorageModel.FileItem>) {
        const queryClient = useQueryClient();
        const errHandler = useResponseFieldErrorHandler();

        return {
            ...useMutation({
                mutationFn: ({itemId, body}: {
                    itemId: FilesStorageModel.FileID,
                    body: FilesStorageModel.UpdateListableStatus
                }) =>
                    filesStorageApi.setFileListableStatus(itemId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({queryKey: FilesStorageQueryKeys.root});
                    queryClient.setQueryData(FilesStorageQueryKeys.file(variables.itemId), data);
                    successHandler?.(data);
                },
            }),
            errHandler,
        };
    }
}

export {FilesStorageQueryKeys};
