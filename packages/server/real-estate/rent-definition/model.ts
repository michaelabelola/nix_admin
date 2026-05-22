import type { Money } from "@suiteonix/models"
import type { AuditSection, NixID } from "@suiteonix/models"
import type { Money_RangedQuery } from "@suiteonix/models"

export namespace RentDefinitionModel {
    export type RentDefinitionID = string | number
    export type MoneyCreate = Money
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
        negotiable: boolean | null
        duration: number | null
        durationUnit: RentDurationUnit | null
    }

    export type Detailed = RentDefinition & {
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        name: string
        description?: string | null
        amount?: MoneyCreate | null
        negotiable?: boolean | null
        duration?: number | null
        durationUnit?: RentDurationUnit | null
        defaultRent?: boolean | null
    }

    export type Update = {
        name?: string | null
        description?: string | null
        amount?: MoneyUpdate | null
        negotiable?: boolean | null
        duration?: number | null
        durationUnit?: RentDurationUnit | null
        defaultRent?: boolean | null
    }

    export type Query = {
        id?: RentDefinitionID
        name?: string
        description?: string
        negotiable?: boolean
        amount?: Money_RangedQuery | null
        duration?: number
        durationUnit?: RentDurationUnit
    }
}
