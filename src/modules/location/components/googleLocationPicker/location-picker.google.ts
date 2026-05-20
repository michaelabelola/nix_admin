import type {GoogleMapsApi} from "./location-picker.types.ts"

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-js-api"

let googleMapsPromise: Promise<GoogleMapsApi> | null = null

export function getGoogleMapsApiKey(apiKey?: string) {
    return (apiKey ?? import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "").trim()
}

export function loadGoogleMaps(apiKey: string) {
    const loadedGoogleMaps = getLoadedGoogleMaps()

    if (loadedGoogleMaps) {
        return Promise.resolve(loadedGoogleMaps)
    }

    if (!googleMapsPromise) {
        googleMapsPromise = createGoogleMapsScript(apiKey).catch((error) => {
            googleMapsPromise = null
            throw error
        })
    }

    return googleMapsPromise
}

function createGoogleMapsScript(apiKey: string) {
    return new Promise<GoogleMapsApi>((resolve, reject) => {
        const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null

        if (existingScript) {
            if (existingScript.dataset.loaded === "true") {
                resolveLoadedGoogleMaps(existingScript, resolve, reject)
                return
            }

            bindScriptResolution(existingScript, resolve, reject)
            return
        }

        const script = document.createElement("script")
        const searchParams = new URLSearchParams({
            key: apiKey,
            libraries: "places",
            v: "weekly",
        })

        script.id = GOOGLE_MAPS_SCRIPT_ID
        script.src = `https://maps.googleapis.com/maps/api/js?${searchParams.toString()}`
        script.async = true
        script.defer = true

        bindScriptResolution(script, resolve, reject)
        document.head.appendChild(script)
    })
}

function bindScriptResolution(
    script: HTMLScriptElement,
    resolve: (googleMaps: GoogleMapsApi) => void,
    reject: () => void
) {
    script.addEventListener("load", () => resolveLoadedGoogleMaps(script, resolve, reject), {once: true})
    script.addEventListener("error", reject, {once: true})
}

function resolveLoadedGoogleMaps(
    script: HTMLScriptElement,
    resolve: (googleMaps: GoogleMapsApi) => void,
    reject: () => void
) {
    script.dataset.loaded = "true"
    const loadedGoogleMaps = getLoadedGoogleMaps()

    if (loadedGoogleMaps) {
        resolve(loadedGoogleMaps)
        return
    }

    reject()
}

function getLoadedGoogleMaps() {
    const googleMaps = window.google

    if (googleMaps?.maps?.places?.AutocompleteService) {
        return googleMaps
    }

    return null
}
