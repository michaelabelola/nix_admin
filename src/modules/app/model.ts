import type {NixID} from "#/models/Models.ts";
import type {NixFile} from "#/models/NixFile.ts";
import type {Auditable} from "#/models/audit.ts";
import type {PagedRequest} from "#/models/PagedModel.ts";
import type {AccessTokenModel} from "#/modules/access-token/model.ts";
import type {PermissionModel} from "#/modules/permissions/Models.ts";
import type {TagModel} from "#/modules/tags/model.ts";

export namespace AppModel {
    export type AppID = NixID

    export type WebhookURL = {
        value: string
        isUp?: boolean | null
    }

    export type App = {
        id: AppID
        name: string
        about: string | null
        description: string | null
        avatar: NixFile.NixImage
        webhook: WebhookURL | null
        tags: TagModel.TagID[]
        entityID: NixID
    }

    export type Detailed = App & Auditable

    export type Create = {
        name: string
        about?: string | null
        description?: string | null
        avatar?: NixFile.NixImage
        webhook?: WebhookURL | null
        tags?: TagModel.TagID[]
        tokenDescription?: string | null
        tokenEnvironment?: AccessTokenModel.TokenEnvironment | null
        tokenExpiresAt?: string | Date | null
        permissions?: PermissionModel.GrantSystemPermission[]
    }

    export type Update = {
        name?: string | null
        about?: string | null
        description?: string | null
        avatar?: NixFile.NixImage
        webhook?: WebhookURL | null
        tags?: TagModel.TagID[]
    }

    export type Created = {
        app: Detailed
        accessToken: string
        permissions: PermissionModel.Permission[]
    }

    export type Query = PagedRequest<{
        id?: AppID
        name?: string
        about?: string
        description?: string
        tags?: TagModel.TagID[]
    }>
}
