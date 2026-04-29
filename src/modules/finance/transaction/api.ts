import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {Paged} from "#/models/PagedModel.ts"
import {PageUtil} from "#/models/PagedModel.ts"
import type {AccountModel} from "#/modules/finance/account/model.ts"
import type {TransactionModel} from "#/modules/finance/transaction/model.ts"

class TransactionApi {
  getById(transactionId: TransactionModel.TransactionID, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<TransactionModel.Detailed>(`/finance/transaction/${transactionId}`, init)
  }

  query(params?: TransactionModel.Query, init?: Partial<RequestHelperInit>) {
    const query = PageUtil.appendRequestToParam(params)
    appendTransactionQueryParams(query, params)

    return Backend.authRequest<Paged<TransactionModel.Transaction>>(`/finance/transactions?${query.toString()}`, init)
  }

  create(accountId: AccountModel.AccountID, body: TransactionModel.Create, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<TransactionModel.Transaction>(`/finance/account/${accountId}/transaction`, {
      method: "POST",
      body,
      ...init,
    })
  }
}

const transactionApi = new TransactionApi()

export default transactionApi

const appendIfDefined = (query: URLSearchParams, key: string, value: unknown) => {
  if (value === undefined || value === null || value === "") return
  query.append(key, String(value))
}

const appendRange = <T,>(query: URLSearchParams, key: string, range?: { start?: T; end?: T; value?: T }) => {
  if (!range) return
  appendIfDefined(query, `${key}.start`, range.start)
  appendIfDefined(query, `${key}.end`, range.end)
  appendIfDefined(query, `${key}.value`, range.value)
}

const appendAuditQuery = (query: URLSearchParams, key: string, audit?: TransactionModel.Query["audit"]) => {
  if (!audit) return
  appendIfDefined(query, `${key}.createdBy`, audit.createdBy)
  appendRange(query, `${key}.createdDate`, audit.createdDate)
  appendRange(query, `${key}.modifiedDate`, audit.modifiedDate)
}

const appendAccountQuery = (query: URLSearchParams, key: string, account?: TransactionModel.LedgerEntryQuery["account"]) => {
  if (!account) return
  appendIfDefined(query, `${key}.query`, account.query)
  appendIfDefined(query, `${key}.id`, account.id)
  appendIfDefined(query, `${key}.name`, account.name)
  appendIfDefined(query, `${key}.description`, account.description)
  appendIfDefined(query, `${key}.type`, account.type)
  appendIfDefined(query, `${key}.status`, account.status)
  appendIfDefined(query, `${key}.accountNumber`, account.accountNumber)
  appendIfDefined(query, `${key}.primaryAccount`, account.primaryAccount)
  appendIfDefined(query, `${key}.entityID`, account.entityID)
  appendIfDefined(query, `${key}.show`, account.show)

  if (account.balance) {
    appendIfDefined(query, `${key}.balance.currency`, account.balance.currency)
    appendRange(query, `${key}.balance.current`, account.balance.current)
    appendRange(query, `${key}.balance.ledger`, account.balance.ledger)
    appendRange(query, `${key}.balance.lastReconciledAt`, account.balance.lastReconciledAt)
    appendRange(query, `${key}.balance.lastSyncedAt`, account.balance.lastSyncedAt)
  }

  if (account.audit) {
    appendIfDefined(query, `${key}.audit.createdBy`, account.audit.createdBy)
    appendRange(query, `${key}.audit.createdDate`, account.audit.createdDate)
    appendRange(query, `${key}.audit.modifiedDate`, account.audit.modifiedDate)
  }
}

const appendEntriesQuery = (query: URLSearchParams, entries?: TransactionModel.Query["entries"]) => {
  entries?.forEach((entry, index) => {
    if (!entry) return
    const key = `entries[${index}]`
    appendIfDefined(query, `${key}.id`, entry.id)
    appendIfDefined(query, `${key}.type`, entry.type)
    appendAccountQuery(query, `${key}.account`, entry.account)
    if (entry.amount) {
      appendRange(query, `${key}.amount.amount`, entry.amount.amount)
      appendIfDefined(query, `${key}.amount.currencyCode`, entry.amount.currencyCode)
    }
    if (entry.audit) {
      appendIfDefined(query, `${key}.audit.createdBy`, entry.audit.createdBy)
      appendRange(query, `${key}.audit.createdDate`, entry.audit.createdDate)
      appendRange(query, `${key}.audit.modifiedDate`, entry.audit.modifiedDate)
    }
  })
}

const appendTransactionQueryParams = (query: URLSearchParams, params?: TransactionModel.Query) => {
  if (!params) return

  appendIfDefined(query, "id", params.id)
  appendIfDefined(query, "type", params.type)
  appendIfDefined(query, "status", params.status)
  appendIfDefined(query, "reference", params.reference)
  appendIfDefined(query, "externalReference", params.externalReference)
  appendIfDefined(query, "narration", params.narration)
  appendIfDefined(query, "entityID", params.entityID)
  appendIfDefined(query, "show", params.show)
  appendRange(query, "occurredAt", params.occurredAt)
  appendRange(query, "settledAt", params.settledAt)
  appendAuditQuery(query, "audit", params.audit)
  appendEntriesQuery(query, params.entries)

  if (params.amount) {
    appendRange(query, "amount.amount", params.amount.amount)
    appendIfDefined(query, "amount.currencyCode", params.amount.currencyCode)
  }
}
