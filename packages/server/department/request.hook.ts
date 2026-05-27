import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {Paged} from "@suiteonix/models"
import {Page_EMPTY} from "@suiteonix/models"
import {useResponseFieldErrorHandler} from "../utils"
import departmentApi from "./api.ts"
import type {DepartmentModel} from "./model.ts"
import type {DeptMemberModel} from "./model.ts"

type SuccessHandler<T> = (data: T) => void

const DepartmentQueryKeys = {
    root: ["departments"] as const,
    query: (query?: DepartmentModel.Query) => [...DepartmentQueryKeys.root, "query", query] as const,
    fts: (query?: DepartmentModel.Query) => [...DepartmentQueryKeys.root, "fts", query] as const,
    detail: (departmentId: DepartmentModel.DepartmentID) => [...DepartmentQueryKeys.root, "detail", departmentId] as const,
    membersRoot: (departmentId: DepartmentModel.DepartmentID) =>
        [...DepartmentQueryKeys.root, "detail", departmentId, "members"] as const,
    members: (
        departmentId: DepartmentModel.DepartmentID,
        query?: DeptMemberModel.Query,
    ) => [...DepartmentQueryKeys.membersRoot(departmentId), "query", query] as const,
}

export namespace DepartmentRequest {
    export const useQueryDepartments = (query?: DepartmentModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: DepartmentQueryKeys.query(query),
                queryFn: () => departmentApi.query(query, {errHandler}),
                initialData: Page_EMPTY as Paged<DepartmentModel.Department>,
            }),
            errHandler,
        }
    }

    export const useQueryDepartmentsFts = (query?: DepartmentModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: DepartmentQueryKeys.fts(query),
                queryFn: () => departmentApi.fullTextSearch(query, {errHandler}),
                initialData: Page_EMPTY as Paged<DepartmentModel.Department>,
            }),
            errHandler,
        }
    }

    export const useGetDepartment = (departmentId?: DepartmentModel.DepartmentID) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: DepartmentQueryKeys.detail(departmentId || ""),
                queryFn: () => departmentApi.getById(departmentId!, {errHandler}),
                enabled: !!departmentId,
            }),
            errHandler,
        }
    }

    export function useCreateDepartment(successHandler?: SuccessHandler<DepartmentModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: DepartmentModel.Create) => departmentApi.create(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: DepartmentQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateDepartment(successHandler?: SuccessHandler<DepartmentModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    departmentId,
                    body,
                }: {
                    departmentId: DepartmentModel.DepartmentID
                    body: DepartmentModel.Update
                }) => departmentApi.update(departmentId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: DepartmentQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: DepartmentQueryKeys.detail(variables.departmentId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteDepartment(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (departmentId: DepartmentModel.DepartmentID) => departmentApi.delete(departmentId, {errHandler}),
                onSuccess: async (_data, departmentId) => {
                    await queryClient.invalidateQueries({queryKey: DepartmentQueryKeys.root})
                    await queryClient.removeQueries({queryKey: DepartmentQueryKeys.detail(departmentId)})
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }

    export function useUploadDepartmentAvatar(successHandler?: SuccessHandler<DepartmentModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    departmentId,
                    file,
                }: {
                    departmentId: DepartmentModel.DepartmentID
                    file: File
                }) => departmentApi.uploadAvatar(departmentId, file, {errHandler}),
                onSuccess: async (data, variables) => {
                    await Promise.all([
                        queryClient.invalidateQueries({queryKey: DepartmentQueryKeys.root}),
                        queryClient.invalidateQueries({queryKey: DepartmentQueryKeys.detail(variables.departmentId)}),
                    ])
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export const useQueryDepartmentMembers = (
        departmentId?: DepartmentModel.DepartmentID,
        query?: DeptMemberModel.Query,
    ) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: DepartmentQueryKeys.members(departmentId || "", query),
                queryFn: () => departmentApi.listMembers(departmentId!, query, {errHandler}),
                enabled: !!departmentId,
                initialData: Page_EMPTY as Paged<DeptMemberModel.DeptMember>,
            }),
            errHandler,
        }
    }

    export function useAddDepartmentMember(successHandler?: SuccessHandler<DeptMemberModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    departmentId,
                    body,
                }: {
                    departmentId: DepartmentModel.DepartmentID
                    body: DeptMemberModel.Add
                }) => departmentApi.addMember(departmentId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({
                        queryKey: DepartmentQueryKeys.membersRoot(variables.departmentId),
                    })
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateDepartmentMemberRole(successHandler?: SuccessHandler<DeptMemberModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    departmentId,
                    memberId,
                    body,
                }: {
                    departmentId: DepartmentModel.DepartmentID
                    memberId: DeptMemberModel.DeptMemberID
                    body: DeptMemberModel.UpdateRole
                }) => departmentApi.updateMemberRole(departmentId, memberId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await queryClient.invalidateQueries({
                        queryKey: DepartmentQueryKeys.membersRoot(variables.departmentId),
                    })
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useRemoveDepartmentMember(successHandler?: () => void) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    departmentId,
                    memberId,
                }: {
                    departmentId: DepartmentModel.DepartmentID
                    memberId: DeptMemberModel.DeptMemberID
                }) => departmentApi.removeMember(departmentId, memberId, {errHandler}),
                onSuccess: async (_data, variables) => {
                    await queryClient.invalidateQueries({
                        queryKey: DepartmentQueryKeys.membersRoot(variables.departmentId),
                    })
                    successHandler?.()
                },
            }),
            errHandler,
        }
    }
}

export {DepartmentQueryKeys}
