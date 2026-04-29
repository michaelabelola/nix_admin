import type {AccountModel} from "#/modules/finance/account/model.ts"
import type {TransactionModel} from "#/modules/finance/transaction/model.ts"

export namespace FinanceQueryKeys {
  export const root = ["finance"] as const

  export const currenciesRoot = [...root, "currencies"] as const
  export const currenciesAll = [...currenciesRoot, "all"] as const
  export const currencies = (query?: string) => [...currenciesRoot, "query", query] as const
  export const currenciesMap = [...currenciesRoot, "map"] as const

  export const accountsRoot = [...root, "accounts"] as const
  export const accounts = (query?: AccountModel.Query) => [...accountsRoot, "list", query] as const
  export const supportedCurrencies = [...accountsRoot, "utils", "supported-currencies"] as const
  export const account = (accountId: AccountModel.AccountID) => [...accountsRoot, accountId] as const
  export const accountRecord = (accountId: AccountModel.AccountID) => [...account(accountId), "record"] as const
  export const accountDetailed = (accountId: AccountModel.AccountID) => [...account(accountId), "detailed"] as const

  export const transactionsRoot = [...root, "transactions"] as const
  export const transactions = (query?: TransactionModel.Query) => [...transactionsRoot, "list", query] as const
  export const transaction = (transactionId: TransactionModel.TransactionID) => [...transactionsRoot, transactionId] as const
}
