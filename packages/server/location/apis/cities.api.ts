import type {Paged} from "@suiteonix/models";
import {BACKEND} from "../../utils";
import type {LocationModel} from "../Models.ts";

export class CitiesApi {

    queryOneCity(query: LocationModel.City_Query) {
        return BACKEND.apiFetch<LocationModel.City>(`location/city`, {query})
    }

    queryCitiesByCountryId(countryId: string | number) {
        return BACKEND.apiFetch<LocationModel.Cities>(`location/country/${countryId}/cities`)
    }

    queryCitiesByCountryIso2AndStateIso2({countryId, stateId}: {
        countryId: string | number,
        stateId: string | number,
    }) {
        return BACKEND.apiFetch<LocationModel.Cities>(`location/country/${countryId}/states/${stateId}/cities`)
    }

    queryCitiesByStateIso2(stateId: string | number) {
        return BACKEND.apiFetch<LocationModel.Cities>(`location/state/${stateId}/cities`)
    }

    queryCities(query: LocationModel.City_Query) {
        return BACKEND.apiFetch<Paged<LocationModel.Cities>>(`location/cities`, {query})

    }

}

const citiesApi = new CitiesApi();
export default citiesApi;
