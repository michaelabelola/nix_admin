import type { Money } from "#/models/Money.model.ts"
import type { AuditSection, NixID } from "#/models/Models.ts"
import type { Money_RangedQuery } from "#/models/Money.model.ts"

export namespace RealEstatePricingModel {
    export type PriceID = string | number
    export type MoneyCreate = Money
    export type MoneyUpdate = Partial<Money>

    export type RealEstatePricing = {
        id: PriceID
        name: string | null
        description: string | null
        amount: Money | null
        negotiable: boolean | null
    }

    export type Detailed = RealEstatePricing & {
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        name: string
        description?: string | null
        negotiable?: boolean | null
        amount: MoneyCreate
    }

    export type Update = {
        name?: string | null
        description?: string | null
        negotiable?: boolean | null
        amount?: MoneyUpdate | null
    }

    export type Query = {
        id?: PriceID
        name?: string
        description?: string
        negotiable?: boolean
        amount?: Money_RangedQuery | null
    }
}
