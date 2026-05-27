import type {AuditSection, NixFile, NixID, PagedRequest} from "@suiteonix/models"
import type {UserModel} from "../user/Models.ts"

export namespace DepartmentModel {
    export type DepartmentID = string

    export enum DepartmentStatus {
        ACTIVE = "ACTIVE",
        INACTIVE = "INACTIVE",
        ARCHIVED = "ARCHIVED",
    }

    export enum DepartmentType {
        EXECUTIVE = "EXECUTIVE",
        OPERATIONS = "OPERATIONS",
        ADMINISTRATION = "ADMINISTRATION",
        FINANCE = "FINANCE",
        HUMAN_RESOURCES = "HUMAN_RESOURCES",
        SALES = "SALES",
        MARKETING = "MARKETING",
        ENGINEERING = "ENGINEERING",
        SUPPORT = "SUPPORT",
        LEGAL = "LEGAL",
        OTHER = "OTHER",
    }

    export type Department = {
        id: DepartmentID
        name: string | null
        code: string | null
        description: string | null
        parentDepartmentId: DepartmentID | null
        email: string | null
        phone: string | null
        location: string | null
        costCenter: string | null
        avatar: NixFile.NixImage | null
        type: DepartmentType | null
        status: DepartmentStatus | null
        displayOrder: number | null
        entityID: NixID
    }

    export type Detailed = Department & {
        audit?: AuditSection | null
    }

    export type Query = PagedRequest<{
        id?: DepartmentID
        name?: string
        code?: string
        parentDepartmentId?: DepartmentID
        rootOnly?: boolean
        email?: string
        phone?: string
        location?: string
        costCenter?: string
        type?: DepartmentType
        status?: DepartmentStatus
    }>

    export type Create = {
        name: string
        code: string
        description?: string | null
        parentDepartmentId?: DepartmentID | null
        email?: string | null
        phone?: string | null
        location?: string | null
        costCenter?: string | null
        type?: DepartmentType | null
        status?: DepartmentStatus | null
        displayOrder?: number | null
    }

    export type Update = {
        name?: string | null
        code?: string | null
        description?: string | null
        parentDepartmentId?: DepartmentID | null
        clearParentDepartment?: boolean | null
        email?: string | null
        phone?: string | null
        location?: string | null
        costCenter?: string | null
        type?: DepartmentType | null
        status?: DepartmentStatus | null
        displayOrder?: number | null
    }
}

export namespace DeptMemberModel {
    export type DeptMemberID = string

    export enum Role {
        HEAD = "HEAD",
        MANAGER = "MANAGER",
        MEMBER = "MEMBER",
    }

    export type DeptMember = {
        id: DeptMemberID
        departmentId: DepartmentModel.DepartmentID
        userId: UserModel.UserID
        role: Role | null
        entityID: NixID
    }

    export type Detailed = DeptMember & {
        audit?: AuditSection | null
    }

    export type Query = PagedRequest<{}>

    export type Add = {
        userId: UserModel.UserID
        role?: Role | null
    }

    export type UpdateRole = {
        role: Role
    }
}
