import type {ReactNode} from "react"

import {Input} from "#/components/ui/input.tsx"
import {Label} from "#/components/ui/label.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx"
import {Switch} from "#/components/ui/switch.tsx"
import {Textarea} from "#/components/ui/textarea.tsx"
import {CountryCombobox} from "#/modules/location/components/CountryCombobox.tsx"
import {StateCombobox} from "#/modules/location/components/StateCombobox.tsx"

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
                <h2 className="font-semibold">{title}</h2>
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
}: {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
    placeholder?: string
    type?: string
}) {
    return (
        <StepField label={label} description={description}>
            <Input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
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
            <CountryCombobox label={false} value={value} onValueChange={onChange}/>
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

export function parseIds(value: string) {
    return [...new Set(value.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean))]
}

export function stringifyIds(values: string[]) {
    return values.join("\n")
}
