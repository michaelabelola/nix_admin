import {useQuery} from "@tanstack/react-query";
import countriesApi from "#/modules/location/apis/countries.api.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";

export namespace CountryAPI {
    function useQueryCountries() {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery({
                queryKey: ["location", "countries", "all"],
                queryFn: () => countriesApi.getAllCountries(),
            }),
            errHandler
        }
    }
}