import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "#/components/ui/combobox.tsx"

export type LocationComboboxOption = {
    label: string
    value: string
}

export function LocationCombobox({
    label,
    value,
    options,
    placeholder,
    emptyLabel,
    disabled,
    onValueChange,
}: {
    label?: string|boolean
    value?: string
    options: LocationComboboxOption[]
    placeholder: string
    emptyLabel: string
    disabled?: boolean
    onValueChange: (value: string) => void
}) {
    const selectedOption = options.find((option) => option.value === value) ?? null

    return (
        <label className="grid gap-2">
            {label ? <span className="text-sm font-medium">{label}</span> : null}
            <Combobox<LocationComboboxOption>
                items={options}
                value={selectedOption}
                itemToStringLabel={(item) => item.label}
                itemToStringValue={(item) => item.value}
                onValueChange={(nextValue) => onValueChange(nextValue?.value ?? "")}
            >
                <ComboboxInput
                    disabled={disabled}
                    placeholder={placeholder}
                    showClear={Boolean(selectedOption)}
                    className="w-full"
                />
                <ComboboxContent>
                    <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
                    <ComboboxList>
                        {options.map((option) => (
                            <ComboboxItem key={option.value} value={option}>
                                {option.label}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </label>
    )
}
