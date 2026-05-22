import type {Paged, PagedRequest} from "#/models/PagedModel.ts";
import {BACKEND} from "#/lib/fetch.ts";

export class CountriesApi {

    queryCountries(params: PagedRequest<LocationModel.Country_Query>) {
        return BACKEND.apiFetch<Paged<LocationModel.Country>>(`location/countries`, {
            query: params
        })
    }

    queryOneCountry(query: LocationModel.Country_Query) {
        return BACKEND.apiFetch<LocationModel.Country>(`location/country`, {
            query: query
        })
    }

    getCountryById(id?: string | number) {
        return BACKEND.apiFetch<LocationModel.Country>(`location/country/${id}`)
    }

    getAllCountries() {
        return BACKEND.apiFetch<LocationModel.Country[]>(`location/countries/all`)
    }
}

const countriesApi = new CountriesApi()
export default countriesApi