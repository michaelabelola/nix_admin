import type {RefObject} from "react"
import {MapPinIcon, SearchIcon} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "#/components/ui/input-group.tsx"

import {LocationPickerPredictionList} from "./LocationPickerPredictionList.tsx"
import type {
    LocationPickerPrediction,
    LocationPickerPredictionState,
} from "./location-picker.types.ts"

type LocationPickerSearchProps = {
    inputId: string
    inputRef: RefObject<HTMLInputElement | null>
    query: string
    inputDisabled: boolean
    searchDisabled: boolean
    predictions: LocationPickerPrediction[]
    predictionState: LocationPickerPredictionState
    isPredictionListOpen: boolean
    activePredictionIndex: number
    onQueryChange: (value: string) => void
    onClosePredictions: () => void
    onMoveActivePrediction: (direction: 1 | -1) => void
    onSelectPrediction: (prediction: LocationPickerPrediction) => void
    onSearch: () => void
}

export function LocationPickerSearch({
                                         inputId,
                                         inputRef,
                                         query,
                                         inputDisabled,
                                         searchDisabled,
                                         predictions,
                                         predictionState,
                                         isPredictionListOpen,
                                         activePredictionIndex,
                                         onQueryChange,
                                         onClosePredictions,
                                         onMoveActivePrediction,
                                         onSelectPrediction,
                                         onSearch,
                                     }: LocationPickerSearchProps) {
    const listId = `${inputId}-predictions`
    const activePredictionId = activePredictionIndex >= 0 ? `${listId}-${activePredictionIndex}` : undefined

    return (
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <label className="grid gap-2" htmlFor={inputId}>
                <span className="text-sm font-medium">Find address</span>
                <div
                    className="relative"
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            onClosePredictions()
                        }
                    }}
                >
                    <InputGroup>
                        <InputGroupAddon>
                            <MapPinIcon className="size-4"/>
                        </InputGroupAddon>
                        <InputGroupInput
                            ref={inputRef}
                            id={inputId}
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={isPredictionListOpen}
                            aria-controls={listId}
                            aria-activedescendant={activePredictionId}
                            value={query}
                            placeholder="Search Google Maps"
                            disabled={inputDisabled}
                            onFocus={() => {
                                if (query.trim()) {
                                    onQueryChange(query)
                                }
                            }}
                            onChange={(event) => onQueryChange(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "ArrowDown") {
                                    event.preventDefault()
                                    onMoveActivePrediction(1)
                                } else if (event.key === "ArrowUp") {
                                    event.preventDefault()
                                    onMoveActivePrediction(-1)
                                } else if (event.key === "Escape") {
                                    event.preventDefault()
                                    onClosePredictions()
                                } else if (event.key === "Enter") {
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
                    <LocationPickerPredictionList
                        id={listId}
                        predictions={predictions}
                        predictionState={predictionState}
                        isOpen={isPredictionListOpen}
                        activePredictionIndex={activePredictionIndex}
                        onSelect={onSelectPrediction}
                    />
                </div>
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
