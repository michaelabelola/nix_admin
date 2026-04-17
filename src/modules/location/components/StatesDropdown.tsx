import {useQuery} from '@tanstack/react-query'

import {Dropdown, type DropdownProps} from '#/components/Dropdown'
import statesApi from '#/modules/location/apis/states.api'

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
    const hasRequiredParams = Boolean(countryIso2 && stateIso2)
    const stateQuery = useQuery({
        queryKey: ['location', 'state', countryIso2, stateIso2],
        queryFn: () =>
            statesApi.getStateByCountryIdAndStateId({
                countryIso2: countryIso2 as string,
                stateIso2: stateIso2 as string,
            }),
        enabled: hasRequiredParams,
    })

    const options = stateQuery.data
        ? [
            {
                label: stateToLabel(stateQuery.data),
                value: stateToValue(stateQuery.data),
            },
        ]
        : []

    const resolvedEmptyLabel = !hasRequiredParams
        ? 'Select a country and state'
        : stateQuery.isPending
            ? 'Loading states...'
            : stateQuery.isError
                ? 'Unable to load states'
                : emptyLabel ?? 'No states available'

    return (
        <Dropdown
            label={label}
            options={options}
            placeholder={placeholder}
            emptyLabel={resolvedEmptyLabel}
            disabled={disabled || !hasRequiredParams || stateQuery.isPending || stateQuery.isError}
            {...props}
        />
    )
}
