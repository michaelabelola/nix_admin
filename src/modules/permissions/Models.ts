import {type NixID, NixModule} from "@/models/Models.ts";
import type {Auditable} from "@/models/audit.ts";
import type {Ownable} from "@/models/PagedModel.ts";

export namespace PermissionModel {
    export type Permission = {
        id: NixID
        name: string
        description: string
        permissionDefinitionId: string
        module: NixModule,
        actions: string[],
        granteeID: NixID,
        granterID: NixID,
        entityID: NixID
    }

    export type Detailed = Permission & Auditable & Ownable

    export type GrantSystemPermission = {
        permissionDefinitionId: string
        actions: string[]
        entityID?: NixID | null
    }
}
