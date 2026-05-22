import * as React from "react"

import {Input} from "#/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select"
import {cn} from "#/lib/utils"
import {CountryAPI} from "#/modules/location/location.hook"

type PhoneNumberInputProps = {
    id?: string
    value?: string
    defaultCountryIso2?: string
    placeholder?: string
    name?: string
    disabled?: boolean
    className?: string
    selectClassName?: string
    inputClassName?: string
    onValueChange?: (value: string) => void
    onBlur?: React.FocusEventHandler<HTMLInputElement>
}

function normalizePhoneCode(phoneCode?: string) {
    if (!phoneCode) {
        return ""
    }

    const trimmed = phoneCode.trim()
    return trimmed.startsWith("+") ? trimmed : `+${trimmed}`
}

function getPhoneNumberParts(value: string | undefined, countries: LocationModel.Country[]) {
    const trimmedValue = value?.trim() ?? ""
    const codes = countries
        .map((country) => normalizePhoneCode(country.phoneCode))
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
    const matchedCode = codes.find((code) => trimmedValue === code || trimmedValue.startsWith(`${code} `))

    if (!matchedCode) {
        return {
            phoneCode: undefined,
            nationalNumber: trimmedValue,
        }
    }

    return {
        phoneCode: matchedCode,
        nationalNumber: trimmedValue.slice(matchedCode.length).trimStart(),
    }
}

function formatPhoneNumber(phoneCode: string, nationalNumber: string) {
    const trimmedNumber = nationalNumber.trim()

    if (!trimmedNumber) {
        return ""
    }

    return `${phoneCode} ${trimmedNumber}`
}

export function PhoneNumberInput({
    id,
    value,
    defaultCountryIso2 = "US",
    placeholder = "555 010 1100",
    name,
    disabled,
    className,
    selectClassName,
    inputClassName,
    onValueChange,
    onBlur,
}: PhoneNumberInputProps) {
    const [selectedIso2, setSelectedIso2] = React.useState(defaultCountryIso2)
    const countriesQuery = CountryAPI.useQueryCountries()
    const countries = React.useMemo(() => {
        return [...(countriesQuery.data ?? [])].sort((a, b) => {
            const regionCompare = a.name.localeCompare(b.name)
            return regionCompare || a.iso2.localeCompare(b.iso2)
        })
    }, [countriesQuery.data])
    const defaultCountry = countries.find((country) => country.iso2 === defaultCountryIso2)
    const parsedValue = getPhoneNumberParts(value, countries)
    const currentCountry = countries.find((country) => country.iso2 === selectedIso2)
    const currentCountryMatchesValue = normalizePhoneCode(currentCountry?.phoneCode) === parsedValue.phoneCode
    const selectedCountry = currentCountryMatchesValue
        ? currentCountry
        : countries.find((country) => normalizePhoneCode(country.phoneCode) === parsedValue.phoneCode)
            ?? currentCountry
            ?? defaultCountry
            ?? countries[0]
    const selectedValue = selectedCountry?.iso2 ?? ""
    const selectedPhoneCode = normalizePhoneCode(selectedCountry?.phoneCode)
    const nationalNumber = parsedValue.nationalNumber
    const isDisabled = disabled || countriesQuery.isPending || countriesQuery.isError || !countries.length

    return (
        <div className={cn("flex w-full min-w-0 rounded-md border border-input shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50", className)}>
            <Select
                value={selectedValue}
                name={`${name}-country`}
                disabled={isDisabled}
                autoComplete={"tel-area-code"}
                onValueChange={(iso2) => {
                    const country = countries.find((entry) => entry.iso2 === iso2)
                    const phoneCode = normalizePhoneCode(country?.phoneCode)

                    setSelectedIso2(iso2)
                    onValueChange?.(formatPhoneNumber(phoneCode, nationalNumber))
                }}
            >
                <SelectTrigger
                    className={cn(
                        "h-9 w-[7.25rem] rounded-r-none border-0 border-r shadow-none focus-visible:ring-0",
                        selectClassName,
                    )}
                    aria-label="Phone code"
                >
                    <SelectValue placeholder={countriesQuery.isPending ? "..." : "+1"}/>
                </SelectTrigger>
                <SelectContent className="max-h-72 bg-background text-foreground">
                    <SelectGroup>
                        <SelectLabel>Phone code</SelectLabel>
                        {countries.map((country) => {
                            const phoneCode = normalizePhoneCode(country.phoneCode)

                            return (
                                <SelectItem key={country.iso2} value={country.iso2} className="text-foreground">
                                    <span>{country.emoji}</span>
                                    <span>{phoneCode}</span>
                                    <span className="text-muted-foreground">{country.iso2}</span>
                                </SelectItem>
                            )
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Input
                id={id}
                name={name}
                type="tel"
                autoComplete={"tel"}
                value={nationalNumber}
                placeholder={placeholder}
                disabled={isDisabled}
                className={cn("h-9 min-w-0 flex-1 rounded-l-none border-0 shadow-none focus-visible:ring-0", inputClassName)}
                onBlur={onBlur}
                onChange={(event) => {
                    onValueChange?.(formatPhoneNumber(selectedPhoneCode, event.target.value))
                }}
            />
        </div>
    )
}
