import {Layers3, Landmark, type LucideIcon} from "lucide-react"

import {AccountModel} from "#/modules/finance/account/model.ts"

export type CreatableAccountType =
  | AccountModel.AccountType.NIX
  | AccountModel.AccountType.AGGREGATE

export const CREATABLE_ACCOUNT_TYPES: Array<{
  type: CreatableAccountType
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    type: AccountModel.AccountType.NIX,
    title: "NIX account",
    description: "Create a native operating account for balances, settlements, and direct ledger activity.",
    icon: Landmark,
  },
  {
    type: AccountModel.AccountType.AGGREGATE,
    title: "Aggregate account",
    description: "Create a grouped account that rolls member accounts into one finance view.",
    icon: Layers3,
  },
]
