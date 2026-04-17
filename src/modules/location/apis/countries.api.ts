import {AuthenticatedRequest, ErrorFieldProcessor, type ErrorFieldProcessorParam} from "@/configs/axios.config.ts";
import type {Paged, PagedRequest} from "@/models/PagedModel.ts";
import type {AxiosResponse} from "axios";

export class CountriesApi {
    queryCountries(params: PagedRequest<LocationModel.Country_Query>, config?: ErrorFieldProcessorParam) {
        return new Promise<Paged<LocationModel.Country>>((resolve, reject) =>
            AuthenticatedRequest.get(`location/countries`, {params})
                .then((response: AxiosResponse<Paged<LocationModel.Country>>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }

    queryOneCountry(params: LocationModel.Country_Query, config?: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.Country_Query>((resolve, reject) =>
            AuthenticatedRequest.get(`location/country`, {params})
                .then((response: AxiosResponse<LocationModel.Country>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }

    getCountryById(id?: string | number, config?: ErrorFieldProcessorParam) {
        if (!id) return Promise.reject("Country ID is required");
        return new Promise<LocationModel.Country>((resolve, reject) =>
            AuthenticatedRequest.get(`location/country/${id}`)
                .then((response: AxiosResponse<LocationModel.Country>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }

    getAllCountries(config?: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.Country[]>((resolve, reject) =>
            AuthenticatedRequest.get(`location/countries/all`)
                .then((response: AxiosResponse<LocationModel.Country[]>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }

}

const countriesApi = new CountriesApi()
export default countriesApi