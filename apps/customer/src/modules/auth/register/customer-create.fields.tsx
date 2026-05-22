import type {ReactNode} from "react"

import {
    DatePicker, parseDateInput, toDateInputValue, Input, Label, Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch, Textarea,
} from "@suiteonix/ui"
import {CountrySelector, StateCombobox} from "@suiteonix/components";

const BIRTH_DATE_START = new Date(1900, 0, 1)

export function StepCountryField({
                                     label,
                                     value,
                                     onChange,
                                     description,
                                 }: {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
}) {
    return (
        <StepField label={label} description={description}>
            <CountrySelector label={false} value={value} onValueChange={onChange}/>
        </StepField>
    )
}

export function StepStateField({
                                   label,
                                   countryIso2,
                                   value,
                                   onChange,
                                   description,
                               }: {
    label: string
    countryIso2?: string
    value: string
    onChange: (value: string) => void
    description?: string
}) {
    return (
        <StepField label={label} description={description}>
            <StateCombobox
                label={undefined}
                countryIso2={countryIso2}
                value={value}
                onValueChange={onChange}
            />
        </StepField>
    )
}

export function StepField({
                              label,
                              description,
                              children,
                          }: {
    label: string
    description?: string
    children: ReactNode
}) {
    return (
        <label className="grid gap-2">
            <Label className="text-sm font-medium">{label}</Label>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            {children}
        </label>
    )
}

export function StepSection({
                                title,
                                description,
                                children,
                            }: {
    title: string
    description?: string
    children: ReactNode
}) {
    return (
        <section className="grid gap-4 rounded-xl p-4">
            <div className="space-y-1">
                <h5 className="font-semibold">{title}</h5>
                {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            </div>
            {children}
        </section>
    )
}

export function StepInput({
                              label,
                              value,
                              onChange,
                              description,
                              placeholder,
                              type = "text",
                              autoComplete
                          }: {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
    placeholder?: string
    type?: string
    autoComplete?: Parameters<typeof Input>[0]["autoComplete"]
}) {
    return (
        <StepField label={label} description={description}>
            <Input
                type={type}
                autoComplete={autoComplete}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </StepField>
    )
}

export function StepDatePicker({
                                   label,
                                   value,
                                   onChange,
                                   description,
                                   placeholder = "Pick a date",
                                   disabled,
                               }: {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
    placeholder?: string
    disabled?: (date: Date) => boolean
}) {
    const selectedDate = parseDateInput(value)
    const today = new Date()

    return (
        <StepField label={label} description={description}>
            <DatePicker
                value={selectedDate}
                placeholder={placeholder}
                captionLayout="dropdown"
                startMonth={BIRTH_DATE_START}
                endMonth={today}
                disabled={disabled}
                onChange={(date) => {
                    if (!date) {
                        return
                    }

                    onChange(toDateInputValue(date))
                }}
            />
        </StepField>
    )
}

export function StepTextarea({
                                 label,
                                 value,
                                 onChange,
                                 description,
                                 placeholder,
                                 rows = 5,
                             }: {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
    placeholder?: string
    rows?: number
}) {
    return (
        <StepField label={label} description={description}>
            <Textarea
                rows={rows}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </StepField>
    )
}

export function StepSelect({
                               label,
                               value,
                               onChange,
                               description,
                               placeholder,
                               options,
                           }: {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
    placeholder?: string
    options: string[]
}) {
    return (
        <StepField label={label} description={description}>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </StepField>
    )
}

export function StepSwitch({
                               label,
                               description,
                               checked,
                               onCheckedChange,
                           }: {
    label: string
    description?: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-1">
                <div className="font-medium">{label}</div>
                {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange}/>
        </div>
    )
}


export function parseIds(value: string) {
    return [...new Set(value.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean))]
}

export function stringifyIds(values: string[]) {
    return values.join("\n")
}
