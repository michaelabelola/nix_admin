import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import type {Paged} from "#/models/PagedModel.ts"
import {PageUtil} from "#/models/PagedModel.ts"
import type {AccountModel} from "#/modules/finance/account/model.ts"

class AccountApi {
  getSupportedCurrencies(init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<AccountModel.SupportedCurrency[]>("/finance/accounts/utils/supported-currencies", init)
  }

  getById(accountId: AccountModel.AccountID, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<AccountModel.Account>(`/finance/account/${accountId}`, init)
  }

  getDetailed(accountId: AccountModel.AccountID, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<AccountModel.Detailed>(`/finance/account/${accountId}/detailed`, init)
  }

  query(params?: AccountModel.Query, init?: Partial<RequestHelperInit>) {
    const query = PageUtil.appendRequestToParam(params)
    appendAccountQueryParams(query, params)

    return Backend.authRequest<Paged<AccountModel.Account>>(`/finance/accounts?${query.toString()}`, init)
  }

  create(body: AccountModel.Create, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<AccountModel.Account>("/finance/account", {
      method: "POST",
      body,
      ...init,
    })
  }
}

const accountApi = new AccountApi()

export default accountApi

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

const appendAuditQuery = (query: URLSearchParams, audit?: AccountModel.Query["audit"]) => {
  if (!audit) return
  appendIfDefined(query, "audit.createdBy", audit.createdBy)
  appendRange(query, "audit.createdDate", audit.createdDate)
  appendRange(query, "audit.modifiedDate", audit.modifiedDate)
}

const appendAccountQueryParams = (query: URLSearchParams, params?: AccountModel.Query) => {
  if (!params) return

  appendIfDefined(query, "id", params.id)
  appendIfDefined(query, "name", params.name)
  appendIfDefined(query, "type", params.type)
  appendIfDefined(query, "status", params.status)
  appendIfDefined(query, "primaryAccount", params.primaryAccount)
  appendIfDefined(query, "entityID", params.entityID)
  appendIfDefined(query, "show", params.show)
  appendAuditQuery(query, params.audit)
}
