import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import {Page_EMPTY} from "#/models/PagedModel.ts";
import tagApi from "#/modules/tags/api.ts";
import type {TagModel} from "#/modules/tags/model.ts";

type SuccessHandler<T> = (data: T) => void

const TagQueryKeys = {
    root: ["tags"] as const,
    query: (query?: TagModel.Query) => [...TagQueryKeys.root, "query", query] as const,
    fts: (query?: TagModel.Query) => [...TagQueryKeys.root, "fts", query] as const,
    detail: (tagId: TagModel.TagID) => [...TagQueryKeys.root, tagId] as const,
    batch: (ids: TagModel.TagID[]) => [...TagQueryKeys.root, "batch", ids] as const,
}

export namespace TagRequest {
    export const useQueryTags = (query: TagModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: TagQueryKeys.query(query),
                queryFn: () => tagApi.query(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useQueryTagsFts = (query: TagModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: TagQueryKeys.fts(query),
                queryFn: () => tagApi.fullTextSearch(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useGetTag = (tagId?: TagModel.TagID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: TagQueryKeys.detail(tagId || ""),
                queryFn: () => tagApi.getById(tagId!, {errHandler}),
                enabled: !!tagId,
            }),
            errHandler,
        }
    }

    export const useGetTagsBatch = (ids: TagModel.TagID[]) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: TagQueryKeys.batch(ids),
                queryFn: () => tagApi.getByIdsBatch(ids, {errHandler}),
                enabled: ids.length > 0,
                initialData: [],
            }),
            errHandler,
        }
    }

    export function useCreateTag(successHandler?: SuccessHandler<TagModel.Tag>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: TagModel.Create) => tagApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: TagQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateTag(successHandler?: SuccessHandler<TagModel.Tag>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({tagId, body}: { tagId: TagModel.TagID; body: TagModel.Update }) =>
                    tagApi.update(tagId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: TagQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: TagQueryKeys.detail(variables.tagId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteTag(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (tagId: TagModel.TagID) => tagApi.delete(tagId, {errHandler}),
                onSuccess: async (_data, tagId) => {
                    await queryClient.invalidateQueries({queryKey: TagQueryKeys.root})
                    await queryClient.removeQueries({queryKey: TagQueryKeys.detail(tagId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}

export {TagQueryKeys}
