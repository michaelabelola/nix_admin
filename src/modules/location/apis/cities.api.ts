import {AuthenticatedRequest, ErrorFieldProcessor, type ErrorFieldProcessorParam} from "@/configs/axios.config.ts";
import type {AxiosResponse} from "axios";
import type {Paged} from "@/models/PagedModel.ts";

export class CitiesApi {
    queryOneCity(params: LocationModel.City_Query, config: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.City>((resolve, reject) =>
            AuthenticatedRequest.get(`location/city`, {params})
                .then((response: AxiosResponse<LocationModel.City>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .catch(reject)
        )
    }

    queryCitiesByCountryId(countryId: string | number, config: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.Cities>((resolve, reject) =>
            AuthenticatedRequest.get(`location/country/${countryId}/cities`)
                .then((response: AxiosResponse<LocationModel.Cities>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .catch(reject)
        )
    }

    queryCitiesByCountryIso2AndStateIso2({countryId, stateId}: {
        countryId: string | number,
        stateId: string | number,
    }, config: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.Cities>((resolve, reject) =>
            AuthenticatedRequest.get(`location/country/${countryId}/states/${stateId}/cities`)
                .then((response: AxiosResponse<LocationModel.Cities>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .catch(reject)
        )
    }

    queryCitiesByStateIso2(stateId: string | number, config: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.Cities>((resolve, reject) =>
            AuthenticatedRequest.get(`location/state/${stateId}/cities`)
                .then((response: AxiosResponse<LocationModel.Cities>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .catch(reject)
        )
    }

    queryCities(params: LocationModel.City_Query, config: ErrorFieldProcessorParam) {
        return new Promise<Paged<LocationModel.Cities>>((resolve, reject) =>
            AuthenticatedRequest.get(`location/cities`, {params})
                .then((response: AxiosResponse<Paged<LocationModel.Cities>>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .catch(reject)
        )
    }

}

export default new CitiesApi();