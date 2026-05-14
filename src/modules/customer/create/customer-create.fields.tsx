import type {ReactNode} from "react"
import {useState} from "react"
import {format} from "date-fns"
import {CalendarIcon} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {Calendar} from "#/components/ui/calendar.tsx"
import {Input} from "#/components/ui/input.tsx"
import {Label} from "#/components/ui/label.tsx"
import {Popover, PopoverContent, PopoverTrigger} from "#/components/ui/popover.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx"
import {Switch} from "#/components/ui/switch.tsx"
import {Textarea} from "#/components/ui/textarea.tsx"
import {cn} from "#/lib/utils.ts"
import {CountryCombobox} from "#/modules/location/components/CountryCombobox.tsx"
import {StateCombobox} from "#/modules/location/components/StateCombobox.tsx"

const BIRTH_DATE_START = new Date(1900, 0, 1)

function parseDateInput(value: string) {
    if (!value) {
        return undefined
    }

    const [year, month, day] = value.split("-").map(Number)

    if (!year || !month || !day) {
        return undefined
    }

    return new Date(year, month - 1, day)
}

function toDateInputValue(date: Date) {
    return format(date, "yyyy-MM-dd")
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
    const [open, setOpen] = useState(false)
    const selectedDate = parseDateInput(value)
    const today = new Date()

    return (
        <StepField label={label} description={description}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="size-4"/>
                        {selectedDate ? format(selectedDate, "PPP") : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        captionLayout="dropdown"
                        startMonth={BIRTH_DATE_START}
                        endMonth={today}
                        disabled={disabled}
                        onSelect={(date) => {
                            if (!date) {
                                return
                            }

                            onChange(toDateInputValue(date))
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
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
