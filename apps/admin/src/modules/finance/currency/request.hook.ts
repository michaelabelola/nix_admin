import {useQuery} from "@tanstack/react-query"

import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx"
import financeCurrencyApi from "#/modules/finance/currency/api.ts"
import {FinanceQueryKeys} from "#/modules/finance/query-keys.ts"

export namespace FinanceCurrencyRequest {
  export const useGetAllCurrencies = () => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.currenciesAll,
        queryFn: () => financeCurrencyApi.getAll({errHandler}),
        initialData: [],
      }),
      errHandler,
    }
  }

  export const useQueryCurrencies = (query?: string | null) => {
    const errHandler = useResponseFieldErrorHandler()
    const normalizedQuery = query?.trim() || undefined

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.currencies(normalizedQuery),
        queryFn: () => financeCurrencyApi.query(normalizedQuery, {errHandler}),
        initialData: [],
      }),
      errHandler,
    }
  }

  export const useGetCurrenciesMap = () => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.currenciesMap,
        queryFn: () => financeCurrencyApi.getMap({errHandler}),
      }),
      errHandler,
    }
  }
}
