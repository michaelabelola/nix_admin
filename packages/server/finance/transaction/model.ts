import type {Money, Money_RangedQuery} from "@suiteonix/models"
import type {AuditSection, NixID} from "@suiteonix/models"
import type {ObjectVisibility, PagedRequest} from "@suiteonix/models"
import type {AccountModel} from "../account/model.ts"
import type {FinanceModel} from "../model.ts"

export namespace TransactionModel {
  export type TransactionID = string

  export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    TRANSFER = "TRANSFER",
    PAYMENT = "PAYMENT",
    REFUND = "REFUND",
    FEE = "FEE",
    ADJUSTMENT = "ADJUSTMENT",
    CHARGEBACK = "CHARGEBACK",
    INTEREST = "INTEREST",
  }

  export enum TransactionStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SETTLED = "SETTLED",
    FAILED = "FAILED",
    REVERSED = "REVERSED",
    CANCELLED = "CANCELLED",
  }

  export enum EntryType {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT",
  }

  export type LedgerEntry = {
    id: number
    type: EntryType
    account?: AccountModel.Account | null
    amount?: Money | null
  }

  export type LedgerEntryDetailed = LedgerEntry & {
    audit?: AuditSection | null
  }

  export type LedgerEntryQuery = {
    id?: number
    type?: EntryType
    account?: AccountModel.Query
    amount?: Money_RangedQuery
    audit?: FinanceModel.AuditQuery
  }

  export type Transaction = {
    id: TransactionID
    entries?: LedgerEntry[] | null
    status?: TransactionStatus | null
    type?: TransactionType | null
    amount?: Money | null
    reference?: string | null
    externalReference?: string | null
    narration?: string | null
    occurredAt?: string | null
    settledAt?: string | null
  }

  export type Detailed = {
    id: TransactionID
    entries?: LedgerEntryDetailed[] | null
    status?: TransactionStatus | null
    type?: TransactionType | null
    amount?: Money | null
    reference?: string | null
    externalReference?: string | null
    narration?: string | null
    occurredAt?: string | null
    settledAt?: string | null
    entityID: NixID
    audit?: AuditSection | null
  }

  export type Counterparty = {
    name?: string | null
    accountNumberMasked?: string | null
    bankName?: string | null
    bankCode?: string | null
    reference?: string | null
  }

  export type Create = {
    type: TransactionType
    status?: TransactionStatus | null
    direction: EntryType
    amount: Money
    feeAmount?: Money | null
    reference?: string | null
    externalReference?: string | null
    narration?: string | null
    counterparty?: Counterparty | null
    occurredAt?: string | null
    settledAt?: string | null
  }

  export type Query = PagedRequest<{
    id?: TransactionID
    entries?: LedgerEntryQuery[]
    status?: TransactionStatus
    type?: TransactionType
    amount?: Money_RangedQuery
    reference?: string
    externalReference?: string
    narration?: string
    occurredAt?: FinanceModel.RangedQuery<string>
    settledAt?: FinanceModel.RangedQuery<string>
    entityID?: NixID
    audit?: FinanceModel.AuditQuery
    show?: ObjectVisibility
  }>
}
