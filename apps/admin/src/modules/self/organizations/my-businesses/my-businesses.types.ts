import type {TableData} from "#/components/data-table/data-table.tsx"
import type {loginApi} from "@suiteonix/server"
import type {OrganizationModel} from "@suiteonix/server"
import type {PermissionModel} from "@suiteonix/server"

export type ProxyLoginRequest = Parameters<typeof loginApi.proxyLogin>[0]["query"]
export type PermissionRow = TableData<
  PermissionModel.Permission,
  OrganizationModel.Organization
>

export type PendingSignIn = {
  request: ProxyLoginRequest
  businessName: string
}
