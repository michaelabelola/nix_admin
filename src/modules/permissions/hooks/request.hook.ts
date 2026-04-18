import {useQuery} from "@tanstack/react-query";
import {Page_EMPTY, type Paged, type PagedRequest} from "@/models/PagedModel.ts";
import permissionsAPI from "#/modules/permissions/permissions.api.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import {type PermissionModel} from "#/modules/permissions/Models.ts";

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