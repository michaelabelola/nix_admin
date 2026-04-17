import {AuthenticatedRequest, ErrorFieldProcessor, type ErrorFieldProcessorParam} from "@/configs/axios.config.ts";
import type {Paged, PagedRequest} from "@/models/PagedModel.ts";
import type {AxiosResponse} from "axios";

export class StatesApi {

    queryStates(params: PagedRequest<LocationModel.State_Query>, config: ErrorFieldProcessorParam) {
        return new Promise<Paged<LocationModel.State>>((resolve, reject) =>
            AuthenticatedRequest.get(`location/states`, {params})
                .then((response: AxiosResponse<Paged<LocationModel.State>>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }


    getAllStatesByCountryId(countryId: string | number, config: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.States>((resolve, reject) =>
            AuthenticatedRequest.get(`location/country/${countryId}/states`)
                .then((response: AxiosResponse<LocationModel.States>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }

    getStateByCountryIdAndStateId({countryIso2, stateIso2}: {
        countryIso2: string,
        stateIso2: string
    }, config: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.State>((resolve, reject) =>
            AuthenticatedRequest.get(`location/country/${countryIso2}/state/${stateIso2}`)
                .then((response: AxiosResponse<LocationModel.State>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }

    queryOneState(params: LocationModel.State_Query, config: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.State>((resolve, reject) =>
            AuthenticatedRequest.get(`location/state`, {params})
                .then((response: AxiosResponse<LocationModel.State>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }

    getStateById(stateId: number, config: ErrorFieldProcessorParam) {
        return new Promise<LocationModel.State>((resolve, reject) =>
            AuthenticatedRequest.get(`location/state/${stateId}`)
                .then((response: AxiosResponse<LocationModel.State>) => resolve(response.data))
                .catch(ErrorFieldProcessor(config))
                .then(reject)
        )
    }

}
export default new StatesApi();