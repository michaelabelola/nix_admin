import type {AuditSection, NixID} from "@/models/Models.ts"
import type {ObjectVisibility, PagedRequest} from "#/models/PagedModel.ts";

export namespace PropertyFeatureModel {
    export type PropertyFeatureID = string
    export type FeatureRuleID = string
    export type TagID = string
    export type FileID = string

    export enum FieldFormat {
        TEXT = "TEXT",
        LONG_TEXT = "LONG_TEXT",
        NUMBER = "NUMBER",
        TIME = "TIME",
        BOOLEAN = "BOOLEAN",
        MONEY = "MONEY",
    }

    export type PropertyFeature = {
        id: PropertyFeatureID
        name: string | null
        description: string | null
        format: FieldFormat | null
        booleanValue: boolean | null
        decimalValue: number | null
        stringValue: string | null
        textValue: string | null
        timeValue: string | null
        unit: string | null
        ruleID: FeatureRuleID | null
        tags: TagID[]
        media: FileID[]
        files: FileID[]
    }

    export type Detailed = {
        id: PropertyFeatureID
        name: string | null
        description: string | null
        format: FieldFormat | null
        booleanValue: boolean | null
        decimalValue: number | null
        stringValue: string | null
        textValue: string | null
        timeValue: string | null
        unit: string | null
        ruleID: FeatureRuleID | null
        tags: TagID[]
        media: FileID[]
        files: FileID[]
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        name?: string | null
        description?: string | null
        format?: FieldFormat | null
        value?: string | null
        unit?: string | null
        featureRuleId?: FeatureRuleID | null
        tags?: TagID[]
        media?: FileID[]
        files?: FileID[]
    }

    export type Update = {
        name?: string | null
        description?: string | null
        value?: string | null
        unit?: string | null
        featureRuleId?: FeatureRuleID | null
        tags?: TagID[]
        media?: FileID[]
        files?: FileID[]
    }
    export type Query = PagedRequest<{
        id?: PropertyFeatureID | null,
        name?: string | null,
        // audit?:AuditSection,
        show?: ObjectVisibility
    }>
}
