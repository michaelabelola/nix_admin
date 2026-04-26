import type {Money} from "#/models/Money.model.ts"
import type {AuditSection, NixID} from "#/models/Models.ts"
import type {ObjectVisibility, PagedRequest} from "#/models/PagedModel.ts"
import type {AccountModel} from "#/modules/finance/account/model.ts"
import type {FinanceModel} from "#/modules/finance/model.ts"

export namespace TransactionModel {
  export type TransactionID = string
  export type BeneficiaryID = string

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

  export enum TransactionDirection {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT",
  }

  export type Counterparty = {
    name?: string | null
    accountNumberMasked?: string | null
    bankName?: string | null
    bankCode?: string | null
    reference?: string | null
  }

  export type Transaction = {
    id: TransactionID
    accountID?: AccountModel.AccountID | null
    beneficiaryID?: BeneficiaryID | null
    type?: TransactionType | null
    status?: TransactionStatus | null
    direction?: TransactionDirection | null
    amount?: Money | null
    feeAmount?: Money | null
    netAmount?: Money | null
    runningBalance?: Money | null
    reference?: string | null
    externalReference?: string | null
    narration?: string | null
    counterparty?: Counterparty | null
    occurredAt?: string | null
    settledAt?: string | null
  }

  export type Detailed = Transaction & {
    entityID: NixID
    audit?: AuditSection | null
  }

  export type Create = {
    beneficiaryID?: BeneficiaryID | null
    type: TransactionType
    status?: TransactionStatus | null
    direction: TransactionDirection
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
    accountID?: AccountModel.AccountID
    beneficiaryID?: BeneficiaryID
    type?: TransactionType
    status?: TransactionStatus
    direction?: TransactionDirection
    reference?: string
    externalReference?: string
    occurredAt?: FinanceModel.RangedQuery<string>
    settledAt?: FinanceModel.RangedQuery<string>
    entityID?: NixID
    audit?: FinanceModel.AuditQuery
    show?: ObjectVisibility
  }>
}
