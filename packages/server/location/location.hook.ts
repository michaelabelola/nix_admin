import {useQuery} from "@tanstack/react-query";
import countriesApi from "./apis/countries.api.ts";
import {useResponseFieldErrorHandler} from "../utils";

export namespace CountryAPI {
    export function useQueryCountries() {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: ["location", "countries", "all"],
                queryFn: () => countriesApi.getAllCountries(),
                staleTime: Infinity
            }),
            errHandler
        }
    }
}
