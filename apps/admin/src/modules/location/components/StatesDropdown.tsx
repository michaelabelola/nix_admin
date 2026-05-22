import {useQuery} from '@tanstack/react-query'

import {Dropdown, type DropdownProps} from '#/components/Dropdown.tsx'
import {statesApi, type LocationModel} from '@suiteonix/server'

type StatesDropdownProps = Omit<DropdownProps, 'options' | 'label' | 'emptyLabel'> & {
    countryIso2?: string
    stateIso2?: string
    label?: string
    emptyLabel?: string
    stateToLabel?: (state: LocationModel.State) => string
    stateToValue?: (state: LocationModel.State) => string
}

export function StatesDropdown({
    countryIso2,
    stateIso2,
    label = 'States',
    placeholder = 'Select a state',
    emptyLabel,
    disabled,
    stateToLabel = (state) => state.name,
    stateToValue = (state) => state.iso2,
    ...props
}: StatesDropdownProps) {
    const hasCountry = Boolean(countryIso2)
    const selectedStateQuery = useQuery({
        queryKey: ['location', 'state', countryIso2, stateIso2],
        queryFn: () =>
            statesApi.getStateByCountryIdAndStateId({
                countryIso2: countryIso2 as string,
                stateIso2: stateIso2 as string,
            }),
        enabled: Boolean(countryIso2 && stateIso2),
    })
    const statesQuery = useQuery({
        queryKey: ['location', 'states', countryIso2],
        queryFn: () =>
            statesApi.queryStates({
                countryCode: countryIso2 as string,
                size: 500,
            }),
        enabled: hasCountry,
    })

    const options = stateIso2 && selectedStateQuery.data
        ? [{
            label: stateToLabel(selectedStateQuery.data),
            value: stateToValue(selectedStateQuery.data),
        }]
        : (statesQuery.data?.content ?? []).map((state) => ({
            label: stateToLabel(state),
            value: stateToValue(state),
        }))

    const resolvedEmptyLabel = !hasCountry
        ? 'Select a country first'
        : stateIso2 && selectedStateQuery.isPending
            ? 'Loading state...'
            : statesQuery.isPending
            ? 'Loading states...'
            : selectedStateQuery.isError || statesQuery.isError
                ? 'Unable to load states'
                : emptyLabel ?? 'No states available'

    return (
        <Dropdown
            label={label}
            options={options}
            placeholder={placeholder}
            emptyLabel={resolvedEmptyLabel}
            disabled={disabled || !hasCountry || statesQuery.isPending || statesQuery.isError}
            {...props}
        />
    )
}
