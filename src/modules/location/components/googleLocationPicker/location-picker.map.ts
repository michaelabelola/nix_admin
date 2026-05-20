import {DEFAULT_CENTER, getSelectedPosition} from "./location-picker.address.ts"
import type {
    GoogleGeocoder,
    GoogleMapInstance,
    GoogleMapsApi,
    GoogleMapsListener,
    GoogleMarkerInstance,
    GooglePlaceResult,
    LatLngLiteral,
    LocationPickerAddress,
} from "./location-picker.types.ts"

type CreateLocationPickerMapOptions = {
    googleMaps: GoogleMapsApi
    mapElement: HTMLDivElement | null
    inputElement: HTMLInputElement | null
    initialValue: LocationPickerAddress
    onPlaceSelected: (place: GooglePlaceResult) => void
    onMapClick: (position: LatLngLiteral) => void
}

type CreatedLocationPickerMap = {
    map: GoogleMapInstance
    marker: GoogleMarkerInstance
    geocoder: GoogleGeocoder
    listeners: GoogleMapsListener[]
}

export function createLocationPickerMap({
                                            googleMaps,
                                            mapElement,
                                            inputElement,
                                            initialValue,
                                            onPlaceSelected,
                                            onMapClick,
                                        }: CreateLocationPickerMapOptions): CreatedLocationPickerMap | null {
    if (!mapElement) return null

    const selectedPosition = getSelectedPosition(initialValue)
    const map = new googleMaps.maps.Map(mapElement, {
        center: selectedPosition ?? DEFAULT_CENTER,
        zoom: selectedPosition ? 16 : 4,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
    })
    const marker = new googleMaps.maps.Marker({
        map,
        position: selectedPosition ?? undefined,
    })
    const listeners = createMapListeners({
        googleMaps,
        inputElement,
        map,
        onPlaceSelected,
        onMapClick,
    })

    return {
        map,
        marker,
        geocoder: new googleMaps.maps.Geocoder(),
        listeners,
    }
}

function createMapListeners({
                                googleMaps,
                                inputElement,
                                map,
                                onPlaceSelected,
                                onMapClick,
                            }: {
    googleMaps: GoogleMapsApi
    inputElement: HTMLInputElement | null
    map: GoogleMapInstance
    onPlaceSelected: (place: GooglePlaceResult) => void
    onMapClick: (position: LatLngLiteral) => void
}) {
    const listeners = [
        map.addListener("click", (event) => {
            const position = event.latLng?.toJSON()

            if (position) {
                onMapClick(position)
            }
        }),
    ]

    if (inputElement) {
        listeners.push(createAutocompleteListener(googleMaps, inputElement, onPlaceSelected))
    }

    return listeners
}

function createAutocompleteListener(
    googleMaps: GoogleMapsApi,
    inputElement: HTMLInputElement,
    onPlaceSelected: (place: GooglePlaceResult) => void
) {
    const autocomplete = new googleMaps.maps.places.Autocomplete(inputElement, {
        fields: ["address_components", "formatted_address", "geometry"],
        types: ["geocode"],
    })

    return autocomplete.addListener("place_changed", () => {
        onPlaceSelected(autocomplete.getPlace())
    })
}
