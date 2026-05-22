import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '#/components/ui/select'
import {cn} from '#/lib/utils'
import type {Input} from "#/components/ui/input.tsx";

export type DropdownOption = {
    label: string
    value: string
    disabled?: boolean
}

export type DropdownProps = {
    label?: string
    options: DropdownOption[]
    placeholder?: string
    emptyLabel?: string
    name?: string
    value?: string
    defaultValue?: string
    disabled?: boolean
    onValueChange?: (value: string) => void
    triggerClassName?: string
    contentClassName?: string
    autoComplete?:Parameters<typeof Input>[0]['autoComplete']
}

export function Dropdown({
    label,
    options,
    placeholder = 'Select an option',
    emptyLabel = 'No options available',
    name,
    value,
    defaultValue,
    disabled,
    onValueChange,
    triggerClassName,
    contentClassName,
    autoComplete
}: DropdownProps) {
    const hasOptions = options.length > 0

    return (
        <Select
            name={name}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled || !hasOptions}
            autoComplete={autoComplete}
            onValueChange={onValueChange}
        >
            <SelectTrigger className={cn('w-full h-12', triggerClassName)}>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectContent className={cn('bg-background text-foreground', contentClassName)}>
                <SelectGroup>
                    {label ? <SelectLabel>{label}</SelectLabel> : null}
                    {hasOptions ? (
                        options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className="text-foreground"
                            >
                                {option.label}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="__empty__" disabled className="text-foreground">
                            {emptyLabel}
                        </SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
