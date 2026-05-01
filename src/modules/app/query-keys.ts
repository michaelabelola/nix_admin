import type {AppModel} from "#/modules/app/model.ts";

export namespace AppQueryKeys {
    export const root = ["apps"] as const
    export const query = (query?: AppModel.Query) => [...root, "query", query] as const
    export const fts = (query?: AppModel.Query) => [...root, "fts", query] as const
    export const detail = (appId: AppModel.AppID) => [...root, appId] as const
}
