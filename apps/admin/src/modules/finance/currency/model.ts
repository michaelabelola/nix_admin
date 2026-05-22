export namespace FinanceCurrencyModel {
  export type CurrencyValue = {
    id: number
    currency: string
    symbol: string
    name: string
    countryCode?: string | null
    countryName?: string | null
  }

  export type CurrencyQuery = {
    query?: string
  }

  export type Country = {
    id: number
    name: string
    iso2: string
    currency: string
    currencyName: string
    currencySymbol: string
  }

  export type CurrencyCountryMap = Record<string, Country[]>
}
