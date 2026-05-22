import type {RequestHelperInit} from "../utils";
import {Backend} from "../utils";

export namespace CurrencyModel {
    export type CurrencyValue = {
        id: number
        currency: string
        symbol: string
        name: string
        countryCode: string | null
        countryName: string | null
    }

    export type Query = {
        query?: string
    }

    export type CurrencyCountryMap = Record<string, LocationModel.Country[]>
}

class CurrencyApi {
    getAllCurrencies(init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CurrencyModel.CurrencyValue[]>("/finance-util/currencies", init)
    }

    queryCurrencies(query?: string, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CurrencyModel.CurrencyValue[]>("/finance-util/currencies/query", {
            ...init,
            query: {
                query,
            },
        })
    }

    getCurrenciesMap(init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CurrencyModel.CurrencyCountryMap>("/finance-util/currencies-map", init)
    }
}

const currencyApi = new CurrencyApi()

export default currencyApi
