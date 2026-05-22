import {type NixID, NixModule} from "@suiteonix/models";
import type {Auditable} from "@suiteonix/models";
import type {Ownable} from "@suiteonix/models";

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
