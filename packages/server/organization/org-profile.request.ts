import {useMemo} from "react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Page_EMPTY, type PageSlice, PageSlice_EMPTY} from "@suiteonix/models";

import {useResponseFieldErrorHandler} from "../utils";
import orgProfileApi from "./apis/OrgProfile.api.ts";
import type {OrgProfileModel} from "./models/org-profile.models.ts";

export const OrgProfileQueryKeys = {
    root: ["org-profiles"] as const,
    detailed: (orgID?: OrgProfileModel.OrgID | null) => [...OrgProfileQueryKeys.root, "detailed", orgID] as const,
    query: (query?: OrgProfileModel.Query) => [...OrgProfileQueryKeys.root, "query", query] as const,
    slice: (query?: OrgProfileModel.Query) => [...OrgProfileQueryKeys.root, "slice", query] as const,
    infiniteSlice: (query?: OrgProfileModel.Query) => [...OrgProfileQueryKeys.root, "slice", "infinite", query] as const,
}

export namespace OrgProfileRequest {
    export const useGetOrgProfileByID = (orgID?: OrgProfileModel.OrgID | null) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: OrgProfileQueryKeys.detailed(orgID),
                queryFn: () => orgProfileApi.getById(orgID!, {errHandler}),
                enabled: Boolean(orgID),
            }),
            errHandler,
        }
    }

    export const useQueryOrgProfiles = (query?: OrgProfileModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: OrgProfileQueryKeys.query(query),
                queryFn: () => orgProfileApi.query(query, {errHandler}),
                initialData: Page_EMPTY,
            }),
            errHandler,
        }
    }

    export const useQueryOrgProfilesSlice = (query?: OrgProfileModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: OrgProfileQueryKeys.slice(query),
                queryFn: () => orgProfileApi.querySlice(query, {errHandler}),
                initialData: PageSlice_EMPTY,
            }),
            errHandler,
        }
    }

    export const useInfiniteQueryOrgProfilesSlice = (query?: OrgProfileModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()
        const infiniteQuery = useInfiniteQuery({
            queryKey: OrgProfileQueryKeys.infiniteSlice(query),
            queryFn: ({pageParam}) => orgProfileApi.querySlice({
                ...query,
                page: pageParam,
            }, {errHandler}),
            initialPageParam: query?.page ?? 0,
            getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextPage : undefined,
        })
        const data = useMemo<PageSlice<OrgProfileModel.OrgProfile>>(() => {
            const pages = infiniteQuery.data?.pages ?? []
            const lastPage = pages.at(-1)

            if (!lastPage) return PageSlice_EMPTY

            return {
                content: pages.flatMap((page) => page.content),
                numberOfElements: pages.reduce((total, page) => total + page.numberOfElements, 0),
                size: lastPage.size,
                number: lastPage.number,
                hasNext: lastPage.hasNext,
                nextPage: lastPage.nextPage,
            }
        }, [infiniteQuery.data?.pages])

        return {
            ...infiniteQuery,
            data,
            errHandler,
        }
    }
}

export default OrgProfileRequest
