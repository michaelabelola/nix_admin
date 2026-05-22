import {Dropdown, type DropdownProps} from "@suiteonix/components";

import {CurrencyRequest, type CurrencyModel} from "@suiteonix/server";
import {useMemo} from "react";

type CurrencyDropdownProps = Omit<DropdownProps, "options" | "label" | "emptyLabel"> & {
    label?: string
    emptyLabel?: string
    full?: boolean
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
                                     full = false,
                                     ...props
                                 }: CurrencyDropdownProps) {
    const currenciesQuery = CurrencyRequest.useGetAllCurrencies()
    const uniqueCurrencies = useMemo(() => groupByCurrency(currenciesQuery.data || []), [currenciesQuery])


    const options =
        Object.entries(uniqueCurrencies)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([currency, obj]) => {
                return ({
                    label: full ? `${currency} - ${obj[0].symbol} (${obj[0].name})` : `${currency} - ${obj[0].symbol}`,
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
