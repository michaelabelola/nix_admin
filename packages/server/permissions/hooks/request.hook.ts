import {useQuery} from "@tanstack/react-query";
import {Page_EMPTY, type Paged, type PagedRequest} from "@suiteonix/models";
import permissionsAPI from "../permissions.api.ts";
import {useResponseFieldErrorHandler} from "../../utils";
import {type PermissionModel} from "../Models.ts";

export namespace PermissionRequest {

    export const useQueryMyLoginAndProxyLoginAccesses = (query?: PagedRequest<any>) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery<Paged<PermissionModel.Permission>>({
                queryKey: ['PermissionsApi.getMyLoginAndProxyLoginAccesses', query],
                queryFn: ({queryKey}) => permissionsAPI.getMyLoginAndProxyLoginAccesses({
                    query: queryKey[1] as any, errHandler
                }),
                staleTime: 0,
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }
    export const useQueryProxyLoginAccesses = (req?: PagedRequest<any>) => {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useQuery<Paged<PermissionModel.Permission>>({
                queryKey: ['PermissionsApi.queryProxyLoginAccesses', req],
                queryFn: ({queryKey}) => permissionsAPI.queryProxyLoginAccesses({
                    query: queryKey[1] as any, errHandler
                }),
                staleTime: 0,
                initialData: Page_EMPTY,
            }),
            errHandler
        }
    }
}

export default PermissionRequest