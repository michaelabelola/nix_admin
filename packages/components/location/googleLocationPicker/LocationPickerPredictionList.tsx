import {MapPinIcon} from "lucide-react"

import type {
    LocationPickerPrediction,
    LocationPickerPredictionState,
} from "./location-picker.types.ts"
import {cn} from "@suiteonix/utils";

type LocationPickerPredictionListProps = {
    id: string
    predictions: LocationPickerPrediction[]
    predictionState: LocationPickerPredictionState
    isOpen: boolean
    activePredictionIndex: number
    onSelect: (prediction: LocationPickerPrediction) => void
}

export function LocationPickerPredictionList({
                                                 id,
                                                 predictions,
                                                 predictionState,
                                                 isOpen,
                                                 activePredictionIndex,
                                                 onSelect,
                                             }: LocationPickerPredictionListProps) {
    if (!isOpen) return null

    return (
        <div
            id={id}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-50 max-h-72 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
            <PredictionStateContent predictionState={predictionState} hasPredictions={predictions.length > 0}/>
            {predictions.map((prediction, index) => (
                <button
                    key={prediction.placeId}
                    id={`${id}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={index === activePredictionIndex}
                    className={cn(
                        "flex w-full items-start gap-2 rounded-sm px-2 py-2 text-left text-sm outline-none",
                        "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                        index === activePredictionIndex ? "bg-accent text-accent-foreground" : ""
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onSelect(prediction)}
                >
                    <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground"/>
                    <span className="grid min-w-0 gap-0.5">
                        <span className="truncate font-medium">{prediction.mainText}</span>
                        {prediction.secondaryText ? (
                            <span className="truncate text-xs text-muted-foreground">{prediction.secondaryText}</span>
                        ) : null}
                    </span>
                </button>
            ))}
        </div>
    )
}

function PredictionStateContent({
                                    predictionState,
                                    hasPredictions,
                                }: {
    predictionState: LocationPickerPredictionState
    hasPredictions: boolean
}) {
    if (hasPredictions) return null

    const message = getPredictionMessage(predictionState)

    if (!message) return null

    return (
        <div className="px-3 py-2 text-sm text-muted-foreground">
            {message}
        </div>
    )
}

function getPredictionMessage(predictionState: LocationPickerPredictionState) {
    if (predictionState === "loading") return "Searching addresses..."
    if (predictionState === "empty") return "No addresses found."
    if (predictionState === "error") return "Unable to load addresses."
    return null
}
