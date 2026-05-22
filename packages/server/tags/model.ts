import type {NixFile} from "@suiteonix/models";
import type {NixID, NixModule} from "@suiteonix/models";
import type {ObjectVisibility, PagedRequest} from "@suiteonix/models";

export namespace TagModel {
    export type TagID = string

    export enum TagType {
        TRANSPORT = "TRANSPORT",
        STATUS = "STATUS",
        IDENTITY = "IDENTITY",
        ACTION = "ACTION",
        DATA = "DATA",
        METRIC = "METRIC",
        CUSTOM = "CUSTOM",
    }

    export type Tag = {
        id: TagID
        name: string | null
        description: string | null
        type: TagType | null
        colorHex: string | null
        icon: NixFile.NixImage
        module: NixModule | null
        entityID: NixID
    }

    export type Query = PagedRequest<{
        type?: TagType
        module?: NixModule
        show?: ObjectVisibility
    }>

    export type Create = {
        name: string
        description?: string | null
        type?: TagType | null
        color?: string | null
        icon?: NixFile.NixImage
        module?: NixModule | null
    }

    export type Update = {
        name?: string | null
        description?: string | null
        type?: TagType | null
        color?: string | null
        icon?: NixFile.NixImage
        module?: NixModule | null
    }
}
