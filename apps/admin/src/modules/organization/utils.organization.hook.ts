import {useQuery} from "@tanstack/react-query";
import organizationUtilsAPI from "#/modules/organization/apis/utils.api.ts";
import {type OrganizationUtils} from "#/modules/organization/models/util.models.ts";

export namespace OrganizationUtilHooks {
    export const useIndustries = () => {
        return useQuery<OrganizationUtils.Industries>({
            queryKey: ['organization-industries-utils'],
            queryFn: () => organizationUtilsAPI.getAllIndustries(),
            staleTime: 0, // 24 hours
            initialData: []
        })
    }
}

export default OrganizationUtilHooks