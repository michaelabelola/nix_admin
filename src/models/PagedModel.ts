export type Page = {
    size: number,
    number: number,
    totalElements: number,
    totalPages: number
}

const Page_Default: Page = {
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0
}

export const Page_EMPTY: Paged<any> = {
    ...Page_Default,
    content: []
}


export type Paged<T> = {
    content: T[];
} & Page

export type PageRequest = Partial<{
    page?: number;
    size?: number;
    sort?: SortParam[];
}>

export enum ObjectVisibility {
    ENTITY_ONLY = "ENTITY_ONLY",
    SYSTEM_ONLY = "SYSTEM_ONLY",
    ENTITY_AND_SYSTEM = "ENTITY_AND_SYSTEM"
}

export type HasObjectFilter = Partial<{
    show?: ObjectVisibility
}>

export type PagedRequest<T> = Partial<T & {
    query?: string;
    page?: number;
    size?: number;
    sort?: SortParam[];
}>
export type Ownable = {
    entityID: string
}

type AuditSort_FieldType = "audit.createdDate" | "audit.modifiedDate" | "audit.createdBy.id" | "audit.modifiedBy.id"

export type SortParam = {
    field: AuditSort_FieldType | string
    direction: "ASC" | "DESC";
};

export type PageSlice<T> = {
    content: T[]
    numberOfElements: number
    size: number
    number: number
    hasNext: boolean
    nextPage: number | null
}

export const PageSlice_EMPTY: PageSlice<never> = {
    content: [],
    numberOfElements: 0,
    size: 0,
    number: 0,
    hasNext: false,
    nextPage: null,
}



export namespace PageUtil {
    export const appendRequestToParam = (req?: PagedRequest<any>, params?: URLSearchParams) => {
        if (params === undefined) params = new URLSearchParams();
        if (!req) return params;
        if (req.query) params.append("query", req.query);
        if (req.page != null) params.append("page", req.page.toString());
        if (req.size) params.append("size", req.size.toString());
        if (req.sort) {
            req.sort.forEach((sort: SortParam) => {
                params.append("sort", `${sort.field},${sort.direction}`);
            });
        }
        return params;
    }
    export const appendAllParams = (
        req?: PagedRequest<Record<string, any>>,
        params?: URLSearchParams,
    ) => {
        if (params === undefined) params = new URLSearchParams();
        if (!req) return params;
        const {query, page, size, sort, ...others} = req;
        if (query) params.append("query", query);
        if (page != null) params.append("page", page.toString());
        if (size) params.append("size", size.toString());
        if (sort) {
            sort.forEach((sort: SortParam) => {
                params.append("sort", `${sort.field},${sort.direction}`);
            });
        }
        if (others && Object.keys(others).length > 0) {
            for (const [key, value] of Object.entries(others)) {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            }
        }
        return params;
    }
}

