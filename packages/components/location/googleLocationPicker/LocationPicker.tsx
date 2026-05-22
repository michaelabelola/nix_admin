
import {LocationPickerMap} from "./LocationPickerMap.tsx"
import {LocationPickerSearch} from "./LocationPickerSearch.tsx"
import type {LocationPickerProps} from "./location-picker.types.ts"
import {useLocationPicker} from "./useLocationPicker.ts"
import {cn} from "@suiteonix/utils";

export type {
    LocationPickerAddress,
    LocationPickerAddressPatch,
} from "./location-picker.types.ts"

export function LocationPicker({
                                   value,
                                   onChange,
                                   apiKey,
                                   className,
                               }: LocationPickerProps) {
    const picker = useLocationPicker({value, onChange, apiKey})

    return (
        <section className={cn("grid gap-3 md:col-span-2", className)}>
            <LocationPickerSearch
                inputId={picker.inputId}
                inputRef={picker.inputRef}
                query={picker.query}
                inputDisabled={picker.inputDisabled}
                searchDisabled={picker.searchDisabled}
                predictions={picker.predictions}
                predictionState={picker.predictionState}
                isPredictionListOpen={picker.isPredictionListOpen}
                activePredictionIndex={picker.activePredictionIndex}
                onQueryChange={picker.setQuery}
                onClosePredictions={picker.closePredictions}
                onMoveActivePrediction={picker.moveActivePrediction}
                onSelectPrediction={picker.selectPrediction}
                onSearch={picker.searchCurrentQuery}
            />
            <LocationPickerMap
                mapElementRef={picker.mapElementRef}
                loadState={picker.loadState}
                lookupState={picker.lookupState}
            />
        </section>
    )
}
