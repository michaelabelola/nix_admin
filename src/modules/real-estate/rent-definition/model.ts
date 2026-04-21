import type { Money } from "@/models/Money.model.ts"
import type { AuditSection, NixID } from "@/models/Models.ts"

export namespace RentDefinitionModel {
    export type RentDefinitionID = string | number
    export type MoneyUpdate = Partial<Money>

    export enum RentDurationUnit {
        DAY = "DAY",
        WEEK = "WEEK",
        MONTH = "MONTH",
        YEAR = "YEAR",
    }

    export type RentDefinition = {
        id: RentDefinitionID
        name: string | null
        description: string | null
        amount: Money | null
        duration: number | null
        durationUnit: RentDurationUnit | null
    }

    export type Detailed = {
        id: RentDefinitionID
        name: string | null
        description: string | null
        amount: Money | null
        duration: number | null
        durationUnit: RentDurationUnit | null
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        name?: string | null
        description?: string | null
        amount?: Money | null
        duration?: number | null
        durationUnit?: RentDurationUnit | null
        defaultRent?: boolean | null
    }

    export type Update = {
        name?: string | null
        description?: string | null
        amount?: MoneyUpdate | null
        duration?: number | null
        durationUnit?: RentDurationUnit | null
        defaultRent?: boolean | null
    }
}
