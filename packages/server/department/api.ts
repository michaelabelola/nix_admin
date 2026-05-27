import type {Paged, ResponseDto} from "@suiteonix/models"
import {Backend, type RequestHelperInit} from "../utils"
import type {DepartmentModel} from "./model.ts"
import type {DeptMemberModel} from "./model.ts"

class DepartmentApi {
    query(params?: DepartmentModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<DepartmentModel.Department>>("/departments/query", {
            query: params,
            ...init,
        })
    }

    fullTextSearch(params?: DepartmentModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<DepartmentModel.Department>>("/departments/fts", {
            query: params,
            ...init,
        })
    }

    getById(departmentId: DepartmentModel.DepartmentID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<DepartmentModel.Detailed>(`/department/${departmentId}`, init)
    }

    create(body: DepartmentModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<DepartmentModel.Detailed>("/department", {
            method: "POST",
            body,
            ...init,
        })
    }

    update(
        departmentId: DepartmentModel.DepartmentID,
        body: DepartmentModel.Update,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<DepartmentModel.Detailed>(`/department/${departmentId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    uploadAvatar(
        departmentId: DepartmentModel.DepartmentID,
        file: File,
        init?: Partial<RequestHelperInit>,
    ) {
        const formData = new FormData()
        formData.append("avatar", file)

        return Backend.authRequest<DepartmentModel.Detailed>(`/department/${departmentId}/avatar`, {
            method: "POST",
            body: formData,
            contentType: "omit",
            ...init,
        })
    }

    delete(departmentId: DepartmentModel.DepartmentID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/department/${departmentId}`, {
            method: "DELETE",
            ...init,
        })
    }

    listMembers(
        departmentId: DepartmentModel.DepartmentID,
        params?: DeptMemberModel.Query,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<Paged<DeptMemberModel.DeptMember>>(
            `/department/${departmentId}/members`,
            {
                query: params,
                ...init,
            },
        )
    }

    addMember(
        departmentId: DepartmentModel.DepartmentID,
        body: DeptMemberModel.Add,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<DeptMemberModel.Detailed>(
            `/department/${departmentId}/members`,
            {
                method: "POST",
                body,
                ...init,
            },
        )
    }

    updateMemberRole(
        departmentId: DepartmentModel.DepartmentID,
        memberId: DeptMemberModel.DeptMemberID,
        body: DeptMemberModel.UpdateRole,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<DeptMemberModel.Detailed>(
            `/department/${departmentId}/members/${memberId}/role`,
            {
                method: "PATCH",
                body,
                ...init,
            },
        )
    }

    removeMember(
        departmentId: DepartmentModel.DepartmentID,
        memberId: DeptMemberModel.DeptMemberID,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<ResponseDto<void>>(
            `/department/${departmentId}/members/${memberId}`,
            {
                method: "DELETE",
                ...init,
            },
        )
    }
}

const departmentApi = new DepartmentApi()
export default departmentApi
