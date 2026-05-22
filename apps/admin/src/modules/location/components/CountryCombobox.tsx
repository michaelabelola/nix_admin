import {useQuery} from "@tanstack/react-query"

import {countriesApi} from "@suiteonix/server"

import {LocationCombobox} from "./LocationCombobox.tsx"

export function CountryCombobox({
                                    label = "Country",
                                    value,
                                    disabled,
                                    onValueChange,
                                }: {
    label?: string | boolean
    value?: string
    disabled?: boolean
    onValueChange: (value: string) => void
}) {
    const countriesQuery = useQuery({
        queryKey: ["location", "countries", "all"],
        queryFn: () => countriesApi.getAllCountries(),
    })

    const options = (countriesQuery.data ?? []).map((country) => ({
        label: `${country.name} (${country.iso2}) ${country.emoji}`,
        value: country.iso2,
    }))

    return (
        <LocationCombobox
            label={label}
            value={value}
            options={options}
            placeholder="Search and select a country"
            emptyLabel={
                countriesQuery.isPending
                    ? "Loading countries..."
                    : countriesQuery.isError
                        ? "Unable to load countries"
                        : "No countries available"
            }
            disabled={disabled || countriesQuery.isPending || countriesQuery.isError}
            onValueChange={onValueChange}
        />
    )
}
