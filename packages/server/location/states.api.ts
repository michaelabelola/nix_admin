import {BACKEND} from "../utils";
import type {Paged, PagedRequest} from "@suiteonix/models";
import type {LocationModel} from "./Models.ts";

export class StatesApi {

    queryStates(query: PagedRequest<LocationModel.State_Query>) {
        return BACKEND.apiFetch<Paged<LocationModel.State>>(`location/states`, {query})
    }

    getAllStatesByCountryId(countryId: string | number) {
        return BACKEND.apiFetch<LocationModel.States>(`location/country/${countryId}/states`)
    }

    getStateByCountryIdAndStateId({countryIso2, stateIso2}: {
        countryIso2: string,
        stateIso2: string
    }) {
        return BACKEND.apiFetch<LocationModel.State>(`location/country/${countryIso2}/state/${stateIso2}`)
    }

    queryOneState(query: LocationModel.State_Query) {
        return BACKEND.apiFetch<LocationModel.State>(`location/state`, {query})
    }

    getStateById(stateId: number) {
        return BACKEND.apiFetch<LocationModel.State>(`location/state/${stateId}`)
    }

}

const statesApi = new StatesApi();
export default statesApi;
