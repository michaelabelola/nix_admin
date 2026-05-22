import type {Money} from "#/models/Money.model.ts"
import type {AuditSection, NixID} from "#/models/Models.ts"
import type {ObjectVisibility, PagedRequest} from "#/models/PagedModel.ts"
import type {FinanceCurrencyModel} from "#/modules/finance/currency/model.ts"
import type {FinanceModel} from "#/modules/finance/model.ts"

export namespace AccountModel {
  export type AccountID = string
  export type SupportedCurrency = FinanceCurrencyModel.CurrencyValue

  export enum AccountType {
    AGGREGATE = "AGGREGATE",
    PROXY = "PROXY",
    NIX = "NIX",
    TRACKER = "TRACKER",
    ESCROW = "ESCROW",
  }

  export enum AccountStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    RESTRICTED = "RESTRICTED",
    FROZEN = "FROZEN",
    CLOSED = "CLOSED",
  }

  export type Balance = {
    currency: string
    current?: Money | null
    ledger?: Money | null
  }

  export type BalanceDetailed = {
    currency: string
    current?: number | null
    ledger?: number | null
    lastReconciledAt?: string | null
    lastSyncedAt?: string | null
  }

  export type BalanceQuery = {
    currency?: string
    current?: FinanceModel.RangedQuery<number>
    ledger?: FinanceModel.RangedQuery<number>
    lastReconciledAt?: FinanceModel.RangedQuery<string>
    lastSyncedAt?: FinanceModel.RangedQuery<string>
  }

  export type Account = {
    id: AccountID
    name?: string | null
    description?: string | null
    type?: AccountType | null
    status?: AccountStatus | null
    balance?: Balance | null
    accountNumber?: string | null
    providerAccountId?: string | null
    providerCustomerId?: string | null
    primaryAccount?: boolean | null
  }

  export type Detailed = {
    id: AccountID
    name?: string | null
    description?: string | null
    type?: AccountType | null
    status?: AccountStatus | null
    balance?: Balance | null
    accountNumber?: string | null
    primaryAccount?: boolean | null
    entityID: NixID
    audit?: AuditSection | null
  }

  export type CreateNix = {
    name: string
    description?: string | null
    primaryAccount?: boolean | null
    currencyCode: string
  }

  export type CreateAggregate = {
    name: string
    description?: string | null
    primaryAccount?: boolean | null
    currencyCode: string
    memberAccounts?: AccountID[] | null
  }

  export type Query = PagedRequest<{
    id?: AccountID
    name?: string
    description?: string
    type?: AccountType
    status?: AccountStatus
    balance?: BalanceQuery
    accountNumber?: string
    primaryAccount?: boolean
    entityID?: NixID
    audit?: FinanceModel.AuditQuery
    show?: ObjectVisibility
  }>
}
