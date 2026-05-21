import type {NixFile} from "#/models/NixFile.ts";
import type {AuditSection, NixID, NixModule} from "#/models/Models.ts";
import type {PageRequest, PagedRequest} from "#/models/PagedModel.ts";

export namespace FilesStorageModel {
    export type FilesStorageID = string | number
    export type FileID = string

    export type FileItem = {
        id: FileID
        name: string | null
        description: string | null
        file: NixFile.NixFile
        thumbnail: NixFile.NixFile
    }

    export type DetailedFileItem = FileItem & {
        entityID: NixID
        audit: AuditSection
    }

    export type FilesStorage = {
        id: FilesStorageID
        name: string | null
        description: string | null
        module: NixModule | null
        coverImage: NixFile.NixFile
        isPublic: boolean | null
    }

    export type Detailed = {
        id: FilesStorageID
        name: string | null
        description: string | null
        module: NixModule | null
        coverImage: NixFile.NixFile
        thumbnail: NixFile.NixFile
        items: FileItem[]
        isPublic: boolean | null
        audit: AuditSection
    }

    export type Query = PagedRequest<{
        name?: string
        isPublic?: boolean
        module?: NixModule
    }>

    export type FullTextSearchQuery = Pick<Query, "query" | "page" | "size" | "sort">
    export type FileQuery = PageRequest

    export type Create = {
        name: string
        description?: string | null
        module?: NixModule | null
        isPublic?: boolean | null
        coverImage?: File | null
    }

    export type Update = {
        name?: string | null
        description?: string | null
        isPublic?: boolean | null
    }

    export type UploadFile = {
        name: string
        description?: string | null
        file?: File | null
    }

    export type UpdateFile = {
        name?: string | null
        description?: string | null
        file?: File | null
    }

    export type UpdateListableStatus = {
        reason?: string | null
    }
}
