import type {AccessTokenModel} from "#/modules/access-token/model.ts";

export namespace AccessTokenQueryKeys {
    export const root = ["access-tokens"] as const
    export const query = (query?: AccessTokenModel.Query) => [...root, "query", query] as const
    export const fts = (query?: AccessTokenModel.Query) => [...root, "fts", query] as const
    export const detail = (accessTokenId: AccessTokenModel.AccessTokenID) => [...root, accessTokenId] as const
}
