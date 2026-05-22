import type {TableData} from "#/components/data-table/data-table.tsx"
import type {loginApi} from "#/modules/auth/signin/api.tsx"
import type {OrganizationModel} from "#/modules/organization/models/models.ts"
import type {PermissionModel} from "#/modules/permissions/Models.ts"

export type ProxyLoginRequest = Parameters<typeof loginApi.proxyLogin>[0]["query"]
export type PermissionRow = TableData<
  PermissionModel.Permission,
  OrganizationModel.Organization
>

export type PendingSignIn = {
  request: ProxyLoginRequest
  businessName: string
}
