import {useQuery} from "@tanstack/react-query";

import {useResponseFieldErrorHandler} from "../utils";

import currencyApi from "./Currency.api.ts";

export namespace CurrencyRequest {
    export const useGetAllCurrencies = () => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ["finance-util", "currencies", "all"],
                queryFn: () => currencyApi.getAllCurrencies({errHandler}),
            }),
            errHandler,
        }
    }

    export const useQueryCurrencies = (query?: string | null) => {
        const errHandler = useResponseFieldErrorHandler()
        const normalizedQuery = query?.trim() || undefined

        return {
            ...useQuery({
                queryKey: ["finance-util", "currencies", "query", normalizedQuery],
                queryFn: () => currencyApi.queryCurrencies(normalizedQuery, {errHandler}),
            }),
            errHandler,
        }
    }

    export const useGetCurrenciesMap = () => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ["finance-util", "currencies", "map"],
                queryFn: () => currencyApi.getCurrenciesMap({errHandler}),
            }),
            errHandler,
        }
    }
}

export default CurrencyRequest
