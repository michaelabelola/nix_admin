export type LocationPickerAddress = {
    apt_number?: string
    street: string
    city: string
    state: string
    country: string
    zipcode: string
    latitude: number
    longitude: number
}

export type LocationPickerAddressPatch = Partial<LocationPickerAddress>

export type LocationPickerProps = {
    value: LocationPickerAddress
    onChange: (patch: LocationPickerAddressPatch) => void
    apiKey?: string
    className?: string
}

export type LocationPickerLoadState = "idle" | "loading" | "ready" | "error" | "missing-key"
export type LocationPickerLookupState = "idle" | "searching" | "error"

export type LatLngLiteral = {
    lat: number
    lng: number
}

export type GoogleMapsApi = {
    maps: {
        Map: new (element: HTMLElement, options: GoogleMapOptions) => GoogleMapInstance
        Marker: new (options: GoogleMarkerOptions) => GoogleMarkerInstance
        Geocoder: new () => GoogleGeocoder
        places: {
            Autocomplete: new (
                input: HTMLInputElement,
                options: GoogleAutocompleteOptions
            ) => GoogleAutocomplete
        }
    }
}

export type GoogleMapOptions = {
    center: LatLngLiteral
    zoom: number
    fullscreenControl?: boolean
    mapTypeControl?: boolean
    streetViewControl?: boolean
}

export type GoogleMapClickEvent = {
    latLng?: {
        toJSON: () => LatLngLiteral
    } | null
}

export type GoogleMapInstance = {
    addListener: (eventName: "click", handler: (event: GoogleMapClickEvent) => void) => GoogleMapsListener
    setCenter: (position: LatLngLiteral) => void
    setZoom: (zoom: number) => void
}

export type GoogleMarkerOptions = {
    map: GoogleMapInstance
    position?: LatLngLiteral
}

export type GoogleMarkerInstance = {
    setMap: (map: GoogleMapInstance | null) => void
    setPosition: (position: LatLngLiteral) => void
}

export type GoogleMapsListener = {
    remove: () => void
}

export type GoogleAutocompleteOptions = {
    fields: string[]
    types: string[]
}

export type GoogleAutocomplete = {
    addListener: (eventName: "place_changed", handler: () => void) => GoogleMapsListener
    getPlace: () => GooglePlaceResult
}

export type GoogleGeocoder = {
    geocode: (
        request: {address?: string; location?: LatLngLiteral},
        callback: (results: GoogleGeocoderResult[] | null, status: string) => void
    ) => void
}

export type GoogleAddressComponent = {
    long_name: string
    short_name: string
    types: string[]
}

export type GooglePlaceResult = {
    address_components?: GoogleAddressComponent[]
    formatted_address?: string
    geometry?: {
        location?: {
            lat: () => number
            lng: () => number
        }
    }
}

export type GoogleGeocoderResult = GooglePlaceResult

declare global {
    interface Window {
        google?: GoogleMapsApi
    }
}
