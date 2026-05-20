import type {RefObject} from "react"
import {MapPinIcon, SearchIcon} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "#/components/ui/input-group.tsx"

type LocationPickerSearchProps = {
    inputId: string
    inputRef: RefObject<HTMLInputElement | null>
    query: string
    inputDisabled: boolean
    searchDisabled: boolean
    onQueryChange: (value: string) => void
    onSearch: () => void
}

export function LocationPickerSearch({
                                         inputId,
                                         inputRef,
                                         query,
                                         inputDisabled,
                                         searchDisabled,
                                         onQueryChange,
                                         onSearch,
                                     }: LocationPickerSearchProps) {
    return (
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <label className="grid gap-2" htmlFor={inputId}>
                <span className="text-sm font-medium">Find address</span>
                <InputGroup>
                    <InputGroupAddon>
                        <MapPinIcon className="size-4"/>
                    </InputGroupAddon>
                    <InputGroupInput
                        ref={inputRef}
                        id={inputId}
                        value={query}
                        placeholder="Search Google Maps"
                        disabled={inputDisabled}
                        onChange={(event) => onQueryChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault()
                                onSearch()
                            }
                        }}
                    />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            type="button"
                            size="icon-xs"
                            aria-label="Search address"
                            disabled={searchDisabled}
                            onClick={onSearch}
                        >
                            <SearchIcon className="size-4"/>
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </label>
            <Button
                type="button"
                variant="outline"
                className="md:w-auto"
                disabled={searchDisabled}
                onClick={onSearch}
            >
                <SearchIcon className="size-4"/>
                Search
            </Button>
        </div>
    )
}
