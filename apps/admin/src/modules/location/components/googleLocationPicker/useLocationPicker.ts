import {useCallback, useEffect, useId, useRef, useState} from "react"

import {
    formatAddressPatch,
    getSelectedPosition,
    toAddressPatch,
} from "./location-picker.address.ts"
import {getGoogleMapsApiKey, loadGoogleMaps} from "./location-picker.google.ts"
import {createLocationPickerMap} from "./location-picker.map.ts"
import {getLocationPredictions} from "./location-picker.predictions.ts"
import type {
    GoogleAutocompleteService,
    GoogleGeocoder,
    GoogleMapInstance,
    GoogleMapsListener,
    GoogleMarkerInstance,
    GooglePlaceResult,
    LatLngLiteral,
    LocationPickerAddress,
    LocationPickerAddressPatch,
    LocationPickerLoadState,
    LocationPickerLookupState,
    LocationPickerPrediction,
    LocationPickerPredictionState,
} from "./location-picker.types.ts"

type UseLocationPickerOptions = {
    value: LocationPickerAddress
    onChange: (patch: LocationPickerAddressPatch) => void
    apiKey?: string
}

export function useLocationPicker({
                                      value,
                                      onChange,
                                      apiKey,
                                  }: UseLocationPickerOptions) {
    const inputId = useId()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const mapElementRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<GoogleMapInstance | null>(null)
    const markerRef = useRef<GoogleMarkerInstance | null>(null)
    const geocoderRef = useRef<GoogleGeocoder | null>(null)
    const autocompleteServiceRef = useRef<GoogleAutocompleteService | null>(null)
    const listenersRef = useRef<GoogleMapsListener[]>([])
    const initialValueRef = useRef(value)
    const onChangeRef = useRef(onChange)
    const selectedQueryRef = useRef("")
    const [query, setQuery] = useState("")
    const [loadState, setLoadState] = useState<LocationPickerLoadState>("idle")
    const [lookupState, setLookupState] = useState<LocationPickerLookupState>("idle")
    const [predictions, setPredictions] = useState<LocationPickerPrediction[]>([])
    const [predictionState, setPredictionState] = useState<LocationPickerPredictionState>("idle")
    const [isPredictionListOpen, setIsPredictionListOpen] = useState(false)
    const [activePredictionIndex, setActivePredictionIndex] = useState(-1)

    const resolvedApiKey = getGoogleMapsApiKey(apiKey)
    const canUseGoogleMaps = Boolean(resolvedApiKey)
    const isSearching = lookupState === "searching"
    const isReady = loadState === "ready"

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    const placeMarker = useCallback((position: LatLngLiteral, zoom = 16) => {
        markerRef.current?.setPosition(position)
        mapRef.current?.setCenter(position)
        mapRef.current?.setZoom(zoom)
    }, [])

    const applyAddressResult = useCallback((result: GooglePlaceResult, fallbackPosition?: LatLngLiteral) => {
        const patch = toAddressPatch(result, fallbackPosition)

        if (!patch) {
            setLookupState("error")
            return
        }

        const nextQuery = result.formatted_address ?? formatAddressPatch(patch)

        selectedQueryRef.current = nextQuery
        onChangeRef.current(patch)
        setQuery(nextQuery)
        setPredictions([])
        setPredictionState("idle")
        setIsPredictionListOpen(false)
        setActivePredictionIndex(-1)
        placeMarker({lat: patch.latitude, lng: patch.longitude})
        setLookupState("idle")
    }, [placeMarker])

    const geocodeAddress = useCallback((address: string) => {
        const geocoder = geocoderRef.current
        const trimmedAddress = address.trim()

        if (!trimmedAddress || !geocoder) return

        setLookupState("searching")
        geocoder.geocode({address: trimmedAddress}, (results, status) => {
            const result = status === "OK" ? results?.[0] : null

            if (result) {
                applyAddressResult(result)
            } else {
                setLookupState("error")
            }
        })
    }, [applyAddressResult])

    const geocodePlaceId = useCallback((placeId: string, fallbackAddress: string) => {
        const geocoder = geocoderRef.current

        if (!geocoder) return

        setLookupState("searching")
        geocoder.geocode({placeId}, (results, status) => {
            const result = status === "OK" ? results?.[0] : null

            if (result) {
                applyAddressResult(result)
            } else {
                geocodeAddress(fallbackAddress)
            }
        })
    }, [applyAddressResult, geocodeAddress])

    const closePredictions = useCallback(() => {
        setIsPredictionListOpen(false)
        setActivePredictionIndex(-1)
    }, [])

    const updateQuery = useCallback((nextQuery: string) => {
        selectedQueryRef.current = ""
        setQuery(nextQuery)
        setIsPredictionListOpen(Boolean(nextQuery.trim()))
        setActivePredictionIndex(-1)
    }, [])

    const selectPrediction = useCallback((prediction: LocationPickerPrediction) => {
        selectedQueryRef.current = prediction.description
        setQuery(prediction.description)
        setPredictions([])
        setPredictionState("idle")
        closePredictions()
        geocodePlaceId(prediction.placeId, prediction.description)
    }, [closePredictions, geocodePlaceId])

    const selectActivePrediction = useCallback(() => {
        const activePrediction = predictions[activePredictionIndex]

        if (isPredictionListOpen && activePrediction) {
            selectPrediction(activePrediction)
            return true
        }

        return false
    }, [activePredictionIndex, isPredictionListOpen, predictions, selectPrediction])

    const searchCurrentQuery = useCallback(() => {
        if (selectActivePrediction()) return

        closePredictions()
        geocodeAddress(query)
    }, [closePredictions, geocodeAddress, query, selectActivePrediction])

    const moveActivePrediction = useCallback((direction: 1 | -1) => {
        if (!predictions.length) return

        setIsPredictionListOpen(true)
        setActivePredictionIndex((currentIndex) => {
            const nextIndex = currentIndex + direction

            if (nextIndex < 0) return predictions.length - 1
            if (nextIndex >= predictions.length) return 0
            return nextIndex
        })
    }, [predictions.length])

    const reverseGeocodePosition = useCallback((position: LatLngLiteral) => {
        const geocoder = geocoderRef.current

        if (!geocoder) return

        placeMarker(position)
        setLookupState("searching")
        geocoder.geocode({location: position}, (results, status) => {
            const result = status === "OK" ? results?.[0] : null

            if (result) {
                applyAddressResult(result, position)
            } else {
                onChangeRef.current({
                    latitude: position.lat,
                    longitude: position.lng,
                })
                setLookupState("error")
            }
        })
    }, [applyAddressResult, placeMarker])

    useEffect(() => {
        if (!canUseGoogleMaps || !resolvedApiKey) {
            setLoadState("missing-key")
            return
        }

        let isMounted = true

        setLoadState("loading")
        loadGoogleMaps(resolvedApiKey)
            .then((googleMaps) => {
                if (!isMounted) return

                const createdMap = createLocationPickerMap({
                    googleMaps:googleMaps as any,
                    mapElement: mapElementRef.current,
                    initialValue: initialValueRef.current,
                    onMapClick: reverseGeocodePosition,
                })

                if (!createdMap) return

                mapRef.current = createdMap.map
                markerRef.current = createdMap.marker
                geocoderRef.current = createdMap.geocoder
                autocompleteServiceRef.current = createdMap.autocompleteService
                listenersRef.current = createdMap.listeners
                setLoadState("ready")
            })
            .catch(() => {
                if (isMounted) {
                    setLoadState("error")
                }
            })

        return () => {
            isMounted = false
            listenersRef.current.forEach((listener) => listener.remove())
            listenersRef.current = []
            markerRef.current?.setMap(null)
            mapRef.current = null
            markerRef.current = null
            geocoderRef.current = null
            autocompleteServiceRef.current = null
        }
    }, [canUseGoogleMaps, resolvedApiKey, reverseGeocodePosition])

    useEffect(() => {
        const service = autocompleteServiceRef.current
        const trimmedQuery = query.trim()

        if (!service || !isReady || !trimmedQuery || selectedQueryRef.current === query) {
            setPredictions([])
            setPredictionState("idle")
            return
        }

        let ignoreResult = false
        const timeout = window.setTimeout(() => {
            setPredictionState("loading")
            getLocationPredictions(service, trimmedQuery)
                .then((nextPredictions) => {
                    if (ignoreResult) return

                    setPredictions(nextPredictions)
                    setPredictionState(nextPredictions.length ? "idle" : "empty")
                    setIsPredictionListOpen(true)
                    setActivePredictionIndex(nextPredictions.length ? 0 : -1)
                })
                .catch(() => {
                    if (ignoreResult) return

                    setPredictions([])
                    setPredictionState("error")
                    setIsPredictionListOpen(true)
                    setActivePredictionIndex(-1)
                })
        }, 250)

        return () => {
            ignoreResult = true
            window.clearTimeout(timeout)
        }
    }, [isReady, query])

    useEffect(() => {
        const position = getSelectedPosition(value)

        if (position && isReady) {
            placeMarker(position)
        }
    }, [isReady, placeMarker, value.latitude, value.longitude])

    return {
        inputId,
        inputRef,
        mapElementRef,
        query,
        setQuery: updateQuery,
        loadState,
        lookupState,
        predictions,
        predictionState,
        isPredictionListOpen,
        activePredictionIndex,
        inputDisabled: !canUseGoogleMaps || loadState === "loading",
        searchDisabled: !query.trim() || !isReady || isSearching,
        closePredictions,
        moveActivePrediction,
        searchCurrentQuery,
        selectPrediction,
    }
}
