import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type OrganizationModel} from "./models/models.ts";
import orgApi from "./apis/Org.api.ts";
import type {NixID} from "@suiteonix/models";
import {Page_EMPTY, type PageRequest} from "@suiteonix/models";
import {useResponseFieldErrorHandler} from "../utils";

type SuccessHandler<T> = (data: T) => void

export const OrganizationQueryKeys = {
    root: ["organizations"] as const,
    record: (orgID?: NixID | null) => [...OrganizationQueryKeys.root, "record", orgID] as const,
    detailed: (orgID?: NixID | null) => [...OrganizationQueryKeys.root, "detailed", orgID] as const,
    me: () => [...OrganizationQueryKeys.root, "me"] as const,
    query: (query?: OrganizationModel.Query) => [...OrganizationQueryKeys.root, "query", query] as const,
    search: (q: string, params?: PageRequest) => [...OrganizationQueryKeys.root, "search", q, params] as const,
}

export namespace OrganizationRequest {
    export const useGetOrganizationByID = (orgID?: NixID | null) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery<OrganizationModel.Organization>({
                queryKey: OrganizationQueryKeys.record(orgID),
                queryFn: () => orgApi.getById(orgID!, {errHandler}),
                enabled: Boolean(orgID),
                staleTime: 0,
            }),
            errHandler,
        }
    }

    export const useGetOrganizationDetailedByID = (orgID?: NixID | null) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery<OrganizationModel.Detailed>({
                queryKey: OrganizationQueryKeys.detailed(orgID),
                queryFn: () => orgApi.getDetailed(orgID!, {errHandler}),
                enabled: Boolean(orgID),
                staleTime: 0,
            }),
            errHandler,
        }
    }

    export const useGetMyOrganization = () => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery<OrganizationModel.Detailed>({
                queryKey: OrganizationQueryKeys.me(),
                queryFn: () => orgApi.getMeDetailed({errHandler}),
                staleTime: 0,
            }),
            errHandler,
        }
    }

    export const useQueryOrganizations = (query?: OrganizationModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: OrganizationQueryKeys.query(query),
                queryFn: () => orgApi.query(query, {errHandler}),
                staleTime: 0,
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useSearchOrganizations = (q: string, params?: PageRequest) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: OrganizationQueryKeys.search(q, params),
                queryFn: () => orgApi.search(q, params, {errHandler}),
                enabled: Boolean(q.trim()),
                staleTime: 0,
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export function useUpdateMyOrganization(successHandler?: SuccessHandler<OrganizationModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: OrganizationModel.Update) => orgApi.updateMe(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: OrganizationQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateMyOrganizationLogos(successHandler?: SuccessHandler<OrganizationModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (files: { logo?: File | null, coverImage?: File | null }) => orgApi.updateMeLogos(files, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: OrganizationQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeactivateMyOrganization(successHandler?: SuccessHandler<OrganizationModel.Organization>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (reason?: string | null) => orgApi.deactivateMe(reason, {errHandler}),
                onSuccess: async (response) => {
                    await queryClient.invalidateQueries({queryKey: OrganizationQueryKeys.root})
                    successHandler?.(response.data)
                },
            }),
            errHandler,
        }
    }

    export function useChangeMyOrganizationStatus(successHandler?: SuccessHandler<OrganizationModel.Organization>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: OrganizationModel.ChangeStatusRequest) => orgApi.changeMeStatus(body, {errHandler}),
                onSuccess: async (response) => {
                    await queryClient.invalidateQueries({queryKey: OrganizationQueryKeys.root})
                    successHandler?.(response.data)
                },
            }),
            errHandler,
        }
    }
}

export default OrganizationRequest
