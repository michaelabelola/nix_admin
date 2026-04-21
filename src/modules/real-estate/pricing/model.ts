import type { Money } from "@/models/Money.model.ts"
import type { AuditSection, NixID } from "@/models/Models.ts"

export namespace RealEstatePricingModel {
    export type PriceID = string | number
    export type MoneyUpdate = Partial<Money>

    export type RealEstatePricing = {
        id: PriceID
        amount: Money
        entityID: NixID
        audit: AuditSection
    }

    export type Create = {
        amount: Money
    }

    export type Update = {
        amount?: MoneyUpdate | null
    }
}
