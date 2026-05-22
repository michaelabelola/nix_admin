import type { Money } from "@suiteonix/models"
import type { AuditSection, NixID } from "@suiteonix/models"
import type { Money_RangedQuery } from "@suiteonix/models"

export namespace LeaseDefinitionModel {
    export type LeaseDefinitionID = string | number
    export type MoneyCreate = Money
    export type MoneyUpdate = Partial<Money>

    export enum LeaseDurationUnit {
        DAY = "DAY",
        WEEK = "WEEK",
        MONTH = "MONTH",
        YEAR = "YEAR",
    }

    export type LeaseDefinition = {
        id: LeaseDefinitionID
        name: string | null
        description: string | null
        amount: Money | null
        negotiable: boolean | null
        duration: number | null
        durationUnit: LeaseDurationUnit | null
    }

    export type Detailed = LeaseDefinition & {
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        name: string
        description?: string | null
        amount?: MoneyCreate | null
        negotiable?: boolean | null
        duration?: number | null
        durationUnit?: LeaseDurationUnit | null
        defaultLease?: boolean | null
    }

    export type Update = {
        name?: string | null
        description?: string | null
        amount?: MoneyUpdate | null
        negotiable?: boolean | null
        duration?: number | null
        durationUnit?: LeaseDurationUnit | null
        defaultLease?: boolean | null
    }

    export type Query = {
        id?: LeaseDefinitionID
        name?: string
        description?: string
        negotiable?: boolean
        amount?: Money_RangedQuery | null
        duration?: number
        durationUnit?: LeaseDurationUnit
    }
}
