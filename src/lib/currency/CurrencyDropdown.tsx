import {Dropdown, type DropdownProps} from "#/components/Dropdown.tsx";

import CurrencyRequest from "./Currency.request.tsx";
import {type CurrencyModel} from "#/lib/currency/Currency.api.ts";
import {useMemo} from "react";

type CurrencyDropdownProps = Omit<DropdownProps, "options" | "label" | "emptyLabel"> & {
    label?: string
    emptyLabel?: string
}

function groupByCurrency(values: CurrencyModel.CurrencyValue[]) {
    return values.reduce<Record<string, CurrencyModel.CurrencyValue[]>>((acc, item) => {
        if (!acc[item.currency]) {
            acc[item.currency] = []
        }
        acc[item.currency].push(item)
        return acc
    }, {})
}

export function CurrencyDropdown({
                                     label = "Currencies",
                                     placeholder = "Select a currency",
                                     emptyLabel,
                                     disabled,
                                     ...props
                                 }: CurrencyDropdownProps) {
    const currenciesQuery = CurrencyRequest.useGetAllCurrencies()
    const uniqueCurrencies = useMemo(() => groupByCurrency(currenciesQuery.data || []), [currenciesQuery])


    const options =
        Object.entries(uniqueCurrencies)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([currency, obj]) => {
                return ({
                    label: `${obj[0].symbol} - ${currency}`,
                    value: currency,
                })

            })

    const resolvedEmptyLabel = currenciesQuery.isPending
        ? "Loading currencies..."
        : currenciesQuery.isError
            ? "Unable to load currencies"
            : emptyLabel ?? "No currencies available"

    return (
        <Dropdown
            label={label}
            options={options}
            placeholder={placeholder}
            emptyLabel={resolvedEmptyLabel}
            disabled={disabled || currenciesQuery.isPending || currenciesQuery.isError}
            {...props}
        />
    )
}
