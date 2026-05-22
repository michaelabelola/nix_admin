import {Backend, type RequestHelperInit} from "../../utils"
import type {Paged} from "@suiteonix/models"
import {PageUtil} from "@suiteonix/models"
import type {AccountModel} from "./model.ts"

class AccountApi {
  getSupportedCurrencies(accountType: AccountModel.AccountType, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<AccountModel.SupportedCurrency[]>(
      `/finance/accounts/utils/supported-currencies?accountType=${encodeURIComponent(accountType)}`,
      init,
    )
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

  createNix(body: AccountModel.CreateNix, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<AccountModel.Detailed>("/finance/account/nix", {
      method: "POST",
      body,
      ...init,
    })
  }

  createAggregate(body: AccountModel.CreateAggregate, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<AccountModel.Detailed>("/finance/account/aggregate", {
      method: "POST",
      body: {
        ...body,
        memberAccounts: body.memberAccounts ?? [],
      },
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

const appendBalanceQuery = (query: URLSearchParams, balance?: AccountModel.BalanceQuery) => {
  if (!balance) return
  appendIfDefined(query, "balance.currency", balance.currency)
  appendRange(query, "balance.current", balance.current)
  appendRange(query, "balance.ledger", balance.ledger)
  appendRange(query, "balance.lastReconciledAt", balance.lastReconciledAt)
  appendRange(query, "balance.lastSyncedAt", balance.lastSyncedAt)
}

const appendAccountQueryParams = (query: URLSearchParams, params?: AccountModel.Query) => {
  if (!params) return

  appendIfDefined(query, "id", params.id)
  appendIfDefined(query, "name", params.name)
  appendIfDefined(query, "description", params.description)
  appendIfDefined(query, "type", params.type)
  appendIfDefined(query, "status", params.status)
  appendIfDefined(query, "accountNumber", params.accountNumber)
  appendIfDefined(query, "primaryAccount", params.primaryAccount)
  appendIfDefined(query, "entityID", params.entityID)
  appendIfDefined(query, "show", params.show)
  appendBalanceQuery(query, params.balance)
  appendAuditQuery(query, params.audit)
}
