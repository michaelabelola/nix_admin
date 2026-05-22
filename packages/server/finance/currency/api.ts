import {Backend, type RequestHelperInit} from "../../utils"

import type {FinanceCurrencyModel} from "./model.ts"

class FinanceCurrencyApi {
  getAll(init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<FinanceCurrencyModel.CurrencyValue[]>("/finance-util/currencies", init)
  }

  query(query?: string, init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<FinanceCurrencyModel.CurrencyValue[]>("/finance-util/currencies/query", {
      ...init,
      query: {
        query,
      },
    })
  }

  getMap(init?: Partial<RequestHelperInit>) {
    return Backend.authRequest<FinanceCurrencyModel.CurrencyCountryMap>("/finance-util/currencies-map", init)
  }
}

const financeCurrencyApi = new FinanceCurrencyApi()

export default financeCurrencyApi
