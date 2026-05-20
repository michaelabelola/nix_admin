import {useCallback, useEffect, useId, useRef, useState} from "react"

import {
    formatAddressPatch,
    getSelectedPosition,
    toAddressPatch,
} from "./location-picker.address.ts"
import {getGoogleMapsApiKey, loadGoogleMaps} from "./location-picker.google.ts"
import {createLocationPickerMap} from "./location-picker.map.ts"
import type {
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
    const listenersRef = useRef<GoogleMapsListener[]>([])
    const initialValueRef = useRef(value)
    const onChangeRef = useRef(onChange)
    const [query, setQuery] = useState("")
    const [loadState, setLoadState] = useState<LocationPickerLoadState>("idle")
    const [lookupState, setLookupState] = useState<LocationPickerLookupState>("idle")

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

        onChangeRef.current(patch)
        setQuery(result.formatted_address ?? formatAddressPatch(patch))
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
                    googleMaps: googleMaps as any,
                    mapElement: mapElementRef.current,
                    inputElement: inputRef.current,
                    initialValue: initialValueRef.current,
                    onPlaceSelected: applyAddressResult,
                    onMapClick: reverseGeocodePosition,
                })

                if (!createdMap) return

                mapRef.current = createdMap.map
                markerRef.current = createdMap.marker
                geocoderRef.current = createdMap.geocoder
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
        }
    }, [applyAddressResult, canUseGoogleMaps, resolvedApiKey, reverseGeocodePosition])

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
        setQuery,
        loadState,
        lookupState,
        inputDisabled: !canUseGoogleMaps || loadState === "loading",
        searchDisabled: !query.trim() || !isReady || isSearching,
        searchCurrentQuery: () => geocodeAddress(query),
    }
}
