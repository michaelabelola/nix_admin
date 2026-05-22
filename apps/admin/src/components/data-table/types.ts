import type * as React from "react"
import type {UseQueryResult} from "@tanstack/react-query"
import type {ColumnDef, RowData, Table as ReactTable, TableOptions} from "@tanstack/react-table"

import type {Paged, PagedRequest, SortParam} from "@suiteonix/server/models"
import type {FileRoutesByTo} from "#/routeTree.gen.ts"

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        sortField?: string
    }
}

type Primitive = string | number | boolean

export type TableFilterValue = Primitive | null | undefined
export type SearchRecord = Record<string, unknown>
export type Updater<T> = T | ((prev: T) => T)
export type DataTableReservedKey = "query" | "page" | "size" | "sort"
export type DataTableRequestBase = PagedRequest<Record<string, TableFilterValue>>
export type DataTableFilterKey<TRequest extends DataTableRequestBase> = Extract<
    Exclude<keyof TRequest, DataTableReservedKey>,
    string
>

export type DataTableFilterField<
    TRequest extends DataTableRequestBase = DataTableRequestBase,
> = {
    key: DataTableFilterKey<TRequest>
    label?: string
    placeholder?: string
    type?: "text" | "select"
    options?: Array<{
        label: string
        value: string
    }>
    parseValue?: (value: string) => TRequest[DataTableFilterKey<TRequest>] | undefined
    serializeValue?: (value: TRequest[DataTableFilterKey<TRequest>] | undefined) => string
}

export type DataTableSearchOptions<TRequest extends DataTableRequestBase> = {
    defaults?: Partial<TRequest>
    filterFields?: Array<DataTableFilterField<TRequest>>
}

export type DataTableProps<
    TData,
    TValue = unknown,
    TRequest extends DataTableRequestBase = DataTableRequestBase,
    T = any
> = {
    columns: Array<ColumnDef<TableData<TData, T>, TValue>>
    from: keyof FileRoutesByTo
    useQuery: (request: TRequest) => UseQueryResult<Paged<TableData<TData, T> | any>>
    defaultQueryFields?:Record<string, unknown>,
    useRowQuery?: (data: TData) => Promise<T>
    initialRequest?: Partial<TRequest>
    filterFields?: Array<DataTableFilterField<TRequest>>
    searchPlaceholder?: string
    emptyMessage?: string
    pageSizeOptions?: number[]
    debounceMs?: number
    getRowId?: TableOptions<TData>["getRowId"]
    toolbarActions?: React.ReactNode
    className?: string
}

export type DataTableToolbarProps<TRequest extends DataTableRequestBase> = {
    filterFields?: Array<DataTableFilterField<TRequest>>
    request: TRequest
    searchDraft: string
    textFilterDrafts: Record<string, string>
    searchPlaceholder: string
    toolbarActions?: React.ReactNode
    isFetching: boolean
    onSearchDraftChange: (value: string) => void
    onTextFilterDraftChange: (key: string, value: string) => void
    onSelectFilterChange: (
        field: DataTableFilterField<TRequest>,
        nextValue: string,
    ) => void
    onRefresh: () => void
    onClear: () => void
}
export type TableData<TData, T> = TData & { __computed?: T }

export type DataTableContentProps<TData, TValue, T = any> = {
    columns: Array<ColumnDef<TableData<TData, T>, TValue>>
    useRowQuery?: (request: TableData<TData, T>) => Promise<any>
    table: ReactTable<TableData<TData, T>>
    isLoading: boolean
    isError: boolean
    emptyMessage: string
    hasRows: boolean
}

export type DataTablePaginationProps = {
    currentPage: number
    totalPages: number
    totalElements: number
    pageNumbers: number[]
    pageSize: number
    pageSizeOptions: number[]
    hasRows: boolean
    pageStart: number
    pageEnd: number
    tableId: string
    onFirstPage: () => void
    onPreviousPage: () => void
    onPageChange: (page: number) => void
    onNextPage: () => void
    onLastPage: () => void
    onPageSizeChange: (value: string) => void
}

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
    return typeof updater === "function"
        ? (updater as (prev: T) => T)(previous)
        : updater
}

export function getFilterValue<
    TRequest extends DataTableRequestBase,
>(request: Partial<TRequest>, key: DataTableFilterKey<TRequest>) {
    return request[key]
}

export function setRequestField<
    TRequest extends DataTableRequestBase,
    TValue,
>(request: Partial<TRequest>, key: keyof TRequest, value: TValue) {
    ;(request as Record<string, TValue>)[key as string] = value
}

export function setReservedRequestField<
    TRequest extends DataTableRequestBase,
>(
    request: Partial<TRequest>,
    key: "query",
    value: string | undefined,
): void
export function setReservedRequestField<
    TRequest extends DataTableRequestBase,
>(
    request: Partial<TRequest>,
    key: "page" | "size",
    value: number | undefined,
): void
export function setReservedRequestField<
    TRequest extends DataTableRequestBase,
>(
    request: Partial<TRequest>,
    key: "sort",
    value: SortParam[] | undefined,
): void
export function setReservedRequestField<
    TRequest extends DataTableRequestBase,
>(
    request: Partial<TRequest>,
    key: DataTableReservedKey,
    value: string | number | SortParam[] | undefined,
) {
    ;(request as Record<DataTableReservedKey, string | number | SortParam[] | undefined>)[key] =
        value
}
