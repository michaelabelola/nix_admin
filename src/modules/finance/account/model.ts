import type {CurrencyModel} from "#/lib/currency/Currency.api.ts"
import type {Money} from "#/models/Money.model.ts"
import type {AuditSection, NixID} from "#/models/Models.ts"
import type {ObjectVisibility, PagedRequest} from "#/models/PagedModel.ts"
import type {FinanceModel} from "#/modules/finance/model.ts"

export namespace AccountModel {
  export type AccountID = string
  export type BalanceID = string
  export type SupportedCurrency = CurrencyModel.CurrencyValue

  export enum AccountType {
    NIX_ACCOUNT = "NIX_ACCOUNT",
    TRACKER_ACCOUNT = "TRACKER_ACCOUNT",
    WALLET = "WALLET",
    CHECKING = "CHECKING",
    SAVINGS = "SAVINGS",
    VIRTUAL = "VIRTUAL",
    ESCROW = "ESCROW",
    LOAN = "LOAN",
    CREDIT = "CREDIT",
  }

  export enum AccountStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    RESTRICTED = "RESTRICTED",
    FROZEN = "FROZEN",
    CLOSED = "CLOSED",
  }

  export type Balance = {
    id: BalanceID
    accountID: AccountID
    currencyCode?: string | null
    availableBalance?: Money | null
    ledgerBalance?: Money | null
    reservedBalance?: Money | null
    primaryBalance?: boolean | null
    lastReconciledAt?: string | null
    lastSyncedAt?: string | null
  }

  export type BalanceDetailed = Balance & {
    entityID: NixID
    audit?: AuditSection | null
  }

  export type Account = {
    id: AccountID
    name?: string | null
    type?: AccountType | null
    status?: AccountStatus | null
    accountNumberMasked?: string | null
    iban?: string | null
    routingNumber?: string | null
    providerAccountId?: string | null
    providerCustomerId?: string | null
    description?: string | null
    primaryAccount?: boolean | null
  }

  export type Detailed = Account & {
    balances?: BalanceDetailed[] | null
    entityID: NixID
    audit?: AuditSection | null
  }

  export type Create = {
    name: string
    type: AccountType
    accountNumberMasked?: string | null
    iban?: string | null
    routingNumber?: string | null
    providerAccountId?: string | null
    providerCustomerId?: string | null
    description?: string | null
    primaryAccount?: boolean | null
    primaryCurrencyCode?: string | null
    currencies?: string[] | null
  }

  export type Query = PagedRequest<{
    id?: AccountID
    name?: string
    type?: AccountType
    status?: AccountStatus
    primaryAccount?: boolean
    entityID?: NixID
    audit?: FinanceModel.AuditQuery
    show?: ObjectVisibility
  }>
}
