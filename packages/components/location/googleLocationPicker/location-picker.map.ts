import {DEFAULT_CENTER, getSelectedPosition} from "./location-picker.address.ts"
import type {
    GoogleGeocoder,
    GoogleAutocompleteService,
    GoogleMapInstance,
    GoogleMapsApi,
    GoogleMapsListener,
    GoogleMarkerInstance,
    LatLngLiteral,
    LocationPickerAddress,
} from "./location-picker.types.ts"

type CreateLocationPickerMapOptions = {
    googleMaps: GoogleMapsApi
    mapElement: HTMLDivElement | null
    initialValue: LocationPickerAddress
    onMapClick: (position: LatLngLiteral) => void
}

type CreatedLocationPickerMap = {
    map: GoogleMapInstance
    marker: GoogleMarkerInstance
    geocoder: GoogleGeocoder
    autocompleteService: GoogleAutocompleteService
    listeners: GoogleMapsListener[]
}

export function createLocationPickerMap({
                                            googleMaps,
                                            mapElement,
                                            initialValue,
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
        map,
        onMapClick,
    })

    return {
        map,
        marker,
        geocoder: new googleMaps.maps.Geocoder(),
        autocompleteService: new googleMaps.maps.places.AutocompleteService(),
        listeners,
    }
}

function createMapListeners({
                                map,
                                onMapClick,
                            }: {
    map: GoogleMapInstance
    onMapClick: (position: LatLngLiteral) => void
}) {
    return [
        map.addListener("click", (event) => {
            const position = event.latLng?.toJSON()

            if (position) {
                onMapClick(position)
            }
        }),
    ]
}
