import type { Money } from "@/models/Money.model.ts"
import type { AuditSection, NixID } from "@/models/Models.ts"

export namespace LeaseDefinitionModel {
    export type LeaseDefinitionID = string | number
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
        duration: number | null
        durationUnit: LeaseDurationUnit | null
    }

    export type Detailed = {
        id: LeaseDefinitionID
        name: string | null
        description: string | null
        amount: Money | null
        duration: number | null
        durationUnit: LeaseDurationUnit | null
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        name?: string | null
        description?: string | null
        amount?: Money | null
        duration?: number | null
        durationUnit?: LeaseDurationUnit | null
        defaultLease?: boolean | null
    }

    export type Update = {
        name?: string | null
        description?: string | null
        amount?: MoneyUpdate | null
        duration?: number | null
        durationUnit?: LeaseDurationUnit | null
        defaultLease?: boolean | null
    }
}
