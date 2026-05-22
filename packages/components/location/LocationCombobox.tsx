import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@suiteonix/ui"

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
    const selectedValue = options.some((option) => option.value === value) ? value : undefined

    return (
        <label className="grid gap-2">
            {label ? <span className="text-sm font-medium">{label}</span> : null}
            <Select
                value={selectedValue}
                disabled={disabled}
                onValueChange={onValueChange}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground">
                    {options.length > 0 ? (
                        options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="__empty__" disabled>
                            {emptyLabel}
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </label>
    )
}
