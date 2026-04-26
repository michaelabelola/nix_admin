import type {AccountModel} from "#/modules/finance/account/model.ts"
import type {TransactionModel} from "#/modules/finance/transaction/model.ts"
import type {Money} from "#/models/Money.model.ts"

export function getAccountDisplayName(
  account?: Pick<AccountModel.Account, "name" | "id"> | Pick<AccountModel.Detailed, "name" | "id">,
) {
  return account?.name?.trim() || account?.id || "Untitled account"
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) return null

  try {
    const date = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(date.getTime())) return String(value)

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  } catch {
    return String(value)
  }
}

export function formatMoney(value?: Money | null) {
  if (!value) return null

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: value.currencyCode,
      maximumFractionDigits: 2,
    }).format(value.amount)
  } catch {
    return `${value.amount} ${value.currencyCode}`
  }
}

export function formatIdentifierList(values?: Array<string | null | undefined> | null) {
  const filtered = values?.filter(Boolean) ?? []
  return filtered.length ? filtered.join(", ") : null
}

export function getPrimaryBalance(account?: AccountModel.Detailed) {
  return account?.balances?.find((balance) => balance.primaryBalance) ?? account?.balances?.[0]
}

export function getAccountCurrencies(account?: AccountModel.Detailed) {
  return Array.from(
    new Set(account?.balances?.map((balance) => balance.currencyCode).filter(Boolean) ?? []),
  )
}

export const accountStatusBadgeVariant: Record<
  AccountModel.AccountStatus,
  "default" | "secondary" | "outline" | "success" | "warning" | "destructive"
> = {
  PENDING: "warning",
  ACTIVE: "success",
  RESTRICTED: "outline",
  FROZEN: "secondary",
  CLOSED: "destructive",
}

export const transactionStatusBadgeVariant: Record<
  TransactionModel.TransactionStatus,
  "default" | "secondary" | "outline" | "success" | "warning" | "destructive"
> = {
  PENDING: "warning",
  PROCESSING: "secondary",
  SETTLED: "success",
  FAILED: "destructive",
  REVERSED: "outline",
  CANCELLED: "outline",
}

export const transactionDirectionBadgeVariant: Record<
  TransactionModel.TransactionDirection,
  "default" | "secondary" | "outline" | "success" | "warning" | "destructive"
> = {
  DEBIT: "warning",
  CREDIT: "success",
}
