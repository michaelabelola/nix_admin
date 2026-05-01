import type {NixID} from "#/models/Models.ts";
import type {Auditable} from "#/models/audit.ts";
import type {PagedRequest} from "#/models/PagedModel.ts";
import type {PermissionModel} from "#/modules/permissions/Models.ts";

export namespace AccessTokenModel {
    export type AccessTokenID = number

    export enum AccessTokenStatus {
        ACTIVE = "ACTIVE",
        FROZEN = "FROZEN",
        DEACTIVATED = "DEACTIVATED",
        EXPIRED = "EXPIRED",
    }

    export enum TokenEnvironment {
        LIVE = "LIVE",
        DEVELOPMENT = "DEVELOPMENT",
        PRODUCTION = "PRODUCTION",
    }

    export type AccessToken = {
        id: AccessTokenID
        description: string | null
        mask: string | null
        status: AccessTokenStatus
        statusReason: string | null
        environment: TokenEnvironment
        expiresAt: string | null
        granteeID: NixID
    }

    export type Detailed = AccessToken & Auditable & {
        entityID: NixID
    }

    export type Created = {
        accessToken: Detailed
        token: string
        permissions: PermissionModel.Permission[]
    }

    export type Create = {
        description?: string | null
        environment?: TokenEnvironment | null
        expiresAt?: string | Date | null
        granteeID: NixID
        permissions?: PermissionModel.GrantSystemPermission[]
    }

    export type ChangeStatus = {
        status: AccessTokenStatus
        reason?: string | null
    }

    export type Deactivate = {
        reason?: string | null
    }

    export type Query = PagedRequest<{
        id?: AccessTokenID
        description?: string
        mask?: string
        status?: AccessTokenStatus
        statusReason?: string
        environment?: TokenEnvironment
        granteeID?: NixID
        expiresAfter?: string | Date
        expiresBefore?: string | Date
    }>
}
