import {useQuery} from "@tanstack/react-query";
import {useResponseFieldErrorHandler} from "../utils";
import countriesApi from "./countries.api.ts";

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
