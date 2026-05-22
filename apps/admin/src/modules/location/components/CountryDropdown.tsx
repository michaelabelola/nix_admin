import {useQuery} from '@tanstack/react-query'

import {Dropdown, type DropdownProps} from '#/components/Dropdown.tsx'
import countriesApi from '#/modules/location/apis/countries.api.ts'

type CountryDropdownProps = Omit<DropdownProps, 'options' | 'label' | 'emptyLabel'> & {
    label?: string
    emptyLabel?: string
    countryToLabel?: (country: LocationModel.Country) => string
    countryToValue?: (country: LocationModel.Country) => string
}

export function CountryDropdown({
                                    label = 'Countries',
                                    placeholder = 'Select a country',
                                    emptyLabel,
                                    disabled,
                                    countryToLabel = (country) => country.name,
                                    countryToValue = (country) => country.iso2,
                                    ...props
                                }: CountryDropdownProps) {
    const countriesQuery = useQuery({
        queryKey: ['location', 'countries', 'all'],
        queryFn: () => countriesApi.getAllCountries(),
    })

    const options = (countriesQuery.data ?? []).map((country) => ({
        label: countryToLabel(country),
        value: countryToValue(country),
    }))

    const resolvedEmptyLabel = countriesQuery.isPending
        ? 'Loading countries...'
        : countriesQuery.isError
            ? 'Unable to load countries'
            : emptyLabel ?? 'No countries available'

    return (
        <Dropdown
            name={props.name}
            label={label}
            options={options}
            placeholder={placeholder}
            autoComplete={"country"}
            emptyLabel={resolvedEmptyLabel}
            disabled={disabled || countriesQuery.isPending || countriesQuery.isError}
            {...props}
        />
    )
}
