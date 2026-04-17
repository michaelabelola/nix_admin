import {useQuery} from "@tanstack/react-query";
import {type OrganizationModel} from "@/modules/organization/models/models.ts";
import organizationApi from "@/modules/organization/apis/Org.api.ts";
import type {NixID} from "@/models/Models.ts";
import {Page_EMPTY} from "@/models/PagedModel.ts";

export namespace OrganizationRequest {
    export const useGetOrganizationByID = ({orgID}: { orgID?: NixID | null }) => {
        return useQuery<OrganizationModel.Organization>({
            queryKey: ['organization', orgID],
            queryFn: ({queryKey}) => organizationApi.getById(queryKey[1] as NixID),
            staleTime: 0, // 24 hours
        })
    }

    export const useQueryOrganizations = (query: OrganizationModel.Query) => {
        return useQuery({
            queryKey: ['organizations', "query", query],
            queryFn: ({queryKey}) => organizationApi.query(queryKey[2] as any),
            staleTime: 0,
            initialData: Page_EMPTY,
        })
    }
}

export default OrganizationRequest