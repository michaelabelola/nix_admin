import * as React from "react"
import {format} from "date-fns"
import {CalendarIcon} from "lucide-react"

import {Button} from "#/components/ui/button"
import {Calendar} from "#/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "#/components/ui/popover"
import {cn} from "#/lib/utils"

type CalendarProps = React.ComponentProps<typeof Calendar>

type DatePickerProps = Omit<CalendarProps, "mode" | "selected" | "onSelect"> & {
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    displayFormat?: string
    buttonClassName?: string
    popoverAlign?: React.ComponentProps<typeof PopoverContent>["align"]
}

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

function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    displayFormat = "PPP",
    buttonClassName,
    popoverAlign = "start",
    className,
    ...calendarProps
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        buttonClassName,
                    )}
                >
                    <CalendarIcon className="size-4"/>
                    {value ? format(value, displayFormat) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align={popoverAlign}>
                <Calendar
                    mode="single"
                    selected={value}
                    className={className}
                    onSelect={(date) => {
                        onChange?.(date)

                        if (date) {
                            setOpen(false)
                        }
                    }}
                    {...calendarProps}
                />
            </PopoverContent>
        </Popover>
    )
}

export {DatePicker, parseDateInput, toDateInputValue}
