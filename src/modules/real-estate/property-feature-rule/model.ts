import type { AuditSection, NixID } from "@/models/Models.ts"

export namespace PropertyFeatureRuleModel {
    export type FeatureRuleID = string
    export type TagID = string

    export enum FieldFormat {
        TEXT = "TEXT",
        LONG_TEXT = "LONG_TEXT",
        NUMBER = "NUMBER",
        TIME = "TIME",
        BOOLEAN = "BOOLEAN",
        MONEY = "MONEY",
    }

    export enum AllowedPropType {
        CUSTOM = "CUSTOM",
        MULTIPLE = "MULTIPLE",
        SINGLE = "SINGLE",
    }

    export type FeatureRuleValue = {
        value: string | null
        description: string | null
    }

    export type PropertyFeatureRule = {
        id: FeatureRuleID
        name: string | null
        description: string | null
        format: FieldFormat | null
        allowedPropType: AllowedPropType | null
        isAddon: boolean | null
        values: FeatureRuleValue[]
        tags: TagID[]
    }

    export type Detailed = {
        id: FeatureRuleID
        name: string | null
        description: string | null
        format: FieldFormat | null
        allowedPropType: AllowedPropType | null
        isAddon: boolean | null
        values: FeatureRuleValue[]
        tags: TagID[]
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        name?: string | null
        description?: string | null
        format?: FieldFormat | null
        allowedPropType?: AllowedPropType | null
        isAddon?: boolean | null
        values?: FeatureRuleValue[]
        tags?: string[]
    }

    export type Update = {
        name?: string | null
        description?: string | null
        format?: FieldFormat | null
        allowedPropType?: AllowedPropType | null
        isAddon?: boolean | null
        values?: FeatureRuleValue[]
        tags?: string[]
    }
}
