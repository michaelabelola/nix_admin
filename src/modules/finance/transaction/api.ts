import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {Paged} from "#/models/PagedModel.ts"
import {PageUtil} from "#/models/PagedModel.ts"
import type {AccountModel} from "#/modules/finance/account/model.ts"
import type {TransactionModel} from "#/modules/finance/transaction/model.ts"

class TransactionApi {
  getById(transactionId: TransactionModel.TransactionID, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<TransactionModel.Transaction>(`/finance/transaction/${transactionId}`, init)
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

const appendAuditQuery = (query: URLSearchParams, audit?: TransactionModel.Query["audit"]) => {
  if (!audit) return
  appendIfDefined(query, "audit.createdBy", audit.createdBy)
  appendRange(query, "audit.createdDate", audit.createdDate)
  appendRange(query, "audit.modifiedDate", audit.modifiedDate)
}

const appendTransactionQueryParams = (query: URLSearchParams, params?: TransactionModel.Query) => {
  if (!params) return

  appendIfDefined(query, "id", params.id)
  appendIfDefined(query, "accountID", params.accountID)
  appendIfDefined(query, "beneficiaryID", params.beneficiaryID)
  appendIfDefined(query, "type", params.type)
  appendIfDefined(query, "status", params.status)
  appendIfDefined(query, "direction", params.direction)
  appendIfDefined(query, "reference", params.reference)
  appendIfDefined(query, "externalReference", params.externalReference)
  appendIfDefined(query, "entityID", params.entityID)
  appendIfDefined(query, "show", params.show)
  appendRange(query, "occurredAt", params.occurredAt)
  appendRange(query, "settledAt", params.settledAt)
  appendAuditQuery(query, params.audit)
}
