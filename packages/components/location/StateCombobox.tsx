import {useQuery} from "@tanstack/react-query"


import {LocationCombobox} from "./LocationCombobox.tsx"
import {statesApi} from "@suiteonix/server";

export function StateCombobox({
                                  label = "State / Province",
                                  countryIso2,
                                  value,
                                  disabled,
                                  onValueChange,
                              }: {
    label?: string
    countryIso2?: string
    value?: string
    disabled?: boolean
    onValueChange: (value: string) => void
}) {
    const hasCountry = Boolean(countryIso2)
    const statesQuery = useQuery({
        queryKey: ["location", "states", countryIso2],
        queryFn: () =>
            statesApi.queryStates({
                countryCode: countryIso2 as string,
                size: 500,
            }),
        enabled: hasCountry,
    })

    const options = (statesQuery.data?.content ?? []).map((state) => ({
        label: state.name,
        value: state.iso2,
    }))

    return (
        <LocationCombobox
            label={label}
            value={value}
            options={options}
            placeholder={hasCountry ? "Search and select a state" : "Select a country first"}
            emptyLabel={
                !hasCountry
                    ? "Select a country first"
                    : statesQuery.isPending
                        ? "Loading states..."
                        : statesQuery.isError
                            ? "Unable to load states"
                            : "No states available"
            }
            disabled={disabled || !hasCountry || statesQuery.isPending || statesQuery.isError}
            onValueChange={onValueChange}
        />
    )
}
