import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {useResponseFieldErrorHandler} from "../utils";
import {Page_EMPTY} from "@suiteonix/models";
import accessTokenApi from "./api.ts";
import type {AccessTokenModel} from "./model.ts";
import {AccessTokenQueryKeys} from "./query-keys.ts";

type SuccessHandler<T> = (data: T) => void

export namespace AccessTokenRequest {
    export const useQueryAccessTokens = (query?: AccessTokenModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: AccessTokenQueryKeys.query(query),
                queryFn: () => accessTokenApi.query(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useQueryAccessTokensFts = (query?: AccessTokenModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: AccessTokenQueryKeys.fts(query),
                queryFn: () => accessTokenApi.fullTextSearch(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useGetAccessToken = (accessTokenId?: AccessTokenModel.AccessTokenID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: AccessTokenQueryKeys.detail(accessTokenId ?? 0),
                queryFn: () => accessTokenApi.getById(accessTokenId!, {errHandler}),
                enabled: accessTokenId !== undefined && accessTokenId !== null,
            }),
            errHandler,
        }
    }

    export function useCreateAccessToken(successHandler?: SuccessHandler<AccessTokenModel.Created>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: AccessTokenModel.Create) => accessTokenApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: AccessTokenQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeactivateAccessToken(successHandler?: SuccessHandler<AccessTokenModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({accessTokenId, body}: { accessTokenId: AccessTokenModel.AccessTokenID; body?: AccessTokenModel.Deactivate }) =>
                    accessTokenApi.deactivate(accessTokenId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: AccessTokenQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: AccessTokenQueryKeys.detail(variables.accessTokenId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useChangeAccessTokenStatus(successHandler?: SuccessHandler<AccessTokenModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({accessTokenId, body}: { accessTokenId: AccessTokenModel.AccessTokenID; body: AccessTokenModel.ChangeStatus }) =>
                    accessTokenApi.changeStatus(accessTokenId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: AccessTokenQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: AccessTokenQueryKeys.detail(variables.accessTokenId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteAccessToken(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (accessTokenId: AccessTokenModel.AccessTokenID) => accessTokenApi.delete(accessTokenId, {errHandler}),
                onSuccess: async (_data, accessTokenId) => {
                    await queryClient.invalidateQueries({queryKey: AccessTokenQueryKeys.root})
                    await queryClient.removeQueries({queryKey: AccessTokenQueryKeys.detail(accessTokenId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}
