import type {RefObject} from "react"

import type {
    LocationPickerLoadState,
    LocationPickerLookupState,
} from "./location-picker.types.ts"
import {cn} from "@suiteonix/utils";

type LocationPickerMapProps = {
    mapElementRef: RefObject<HTMLDivElement | null>
    loadState: LocationPickerLoadState
    lookupState: LocationPickerLookupState
}

export function LocationPickerMap({
                                      mapElementRef,
                                      loadState,
                                      lookupState,
                                  }: LocationPickerMapProps) {
    const mapMessage = getMapMessage(loadState, lookupState)

    return (
        <div
            className="relative h-64 overflow-hidden rounded-md border bg-muted"
            aria-busy={loadState === "loading" || lookupState === "searching"}
        >
            <div ref={mapElementRef} className={cn("h-full w-full", loadState === "ready" ? "" : "invisible")}/>
            {mapMessage ? (
                <div className="pointer-events-none absolute inset-0 grid place-items-center px-4 text-center text-sm text-muted-foreground">
                    <span>{mapMessage}</span>
                </div>
            ) : null}
        </div>
    )
}

function getMapMessage(loadState: LocationPickerLoadState, lookupState: LocationPickerLookupState) {
    if (loadState === "missing-key") return "Google Maps API key is missing."
    if (loadState === "loading") return "Loading Google Maps..."
    if (loadState === "error") return "Unable to load Google Maps."
    if (lookupState === "searching") return "Finding address..."
    if (lookupState === "error") return "Address not found."
    return null
}
