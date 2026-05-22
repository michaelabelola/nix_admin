import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {useResponseFieldErrorHandler} from "../utils";
import {Page_EMPTY} from "@suiteonix/models";
import appApi from "./api.ts";
import type {AppModel} from "./model.ts";
import {AppQueryKeys} from "./query-keys.ts";
import {AccessTokenQueryKeys} from "../access-token/query-keys.ts";

type SuccessHandler<T> = (data: T) => void

export namespace AppRequest {
    export const useQueryApps = (query?: AppModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: AppQueryKeys.query(query),
                queryFn: () => appApi.query(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useQueryAppsFts = (query?: AppModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: AppQueryKeys.fts(query),
                queryFn: () => appApi.fullTextSearch(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useGetApp = (appId?: AppModel.AppID) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: AppQueryKeys.detail(appId || ""),
                queryFn: () => appApi.getById(appId!, {errHandler}),
                enabled: !!appId,
            }),
            errHandler,
        }
    }

    export function useCreateApp(successHandler?: SuccessHandler<AppModel.Created>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: AppModel.Create) => appApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: AppQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: AccessTokenQueryKeys.root}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateApp(successHandler?: SuccessHandler<AppModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({appId, body}: { appId: AppModel.AppID; body: AppModel.Update }) =>
                    appApi.update(appId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: AppQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: AppQueryKeys.detail(variables.appId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteApp(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (appId: AppModel.AppID) => appApi.delete(appId, {errHandler}),
                onSuccess: async (_data, appId) => {
                    await queryClient.invalidateQueries({queryKey: AppQueryKeys.root})
                    await queryClient.removeQueries({queryKey: AppQueryKeys.detail(appId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}
