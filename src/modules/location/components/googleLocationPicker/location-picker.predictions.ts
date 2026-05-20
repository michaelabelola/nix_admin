import type {
    GoogleAutocompleteService,
    GooglePlacePrediction,
    LocationPickerPrediction,
} from "./location-picker.types.ts"

const PREDICTION_TYPES = ["geocode"]

export function getLocationPredictions(
    service: GoogleAutocompleteService,
    input: string
) {
    return new Promise<LocationPickerPrediction[]>((resolve, reject) => {
        service.getPlacePredictions({input, types: PREDICTION_TYPES}, (predictions, status) => {
            if (status === "OK") {
                resolve((predictions ?? []).map(toLocationPickerPrediction))
                return
            }

            if (status === "ZERO_RESULTS") {
                resolve([])
                return
            }

            reject(new Error(status))
        })
    })
}

function toLocationPickerPrediction(prediction: GooglePlacePrediction): LocationPickerPrediction {
    return {
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting?.main_text ?? prediction.description,
        secondaryText: prediction.structured_formatting?.secondary_text ?? "",
    }
}
