import * as React from "react"
import {getCoreRowModel, useReactTable} from "@tanstack/react-table"

import {cn} from "#/lib/utils.ts"

import {DataTableContent} from "./data-table-content.tsx"
import {DataTablePagination} from "./data-table-pagination.tsx"
import {DataTableToolbar, defaultParseValue} from "./data-table-toolbar.tsx"
import {defaultSerializeValue, useDataTableQueryState} from "./search-state.ts"
import {
    DEFAULT_PAGE_SIZE_OPTIONS,
    type DataTableFilterField,
    type DataTableProps,
    type DataTableRequestBase,
    getFilterValue,
    resolveUpdater,
    setRequestField,
    setReservedRequestField, type TableData,
} from "./types.ts"
import {
    getSortFieldByColumnId,
    getSortingStateFromRequest,
    makePaginationRange,
} from "./sorting.ts"

function useTextFilterFields<TRequest extends DataTableRequestBase>(
    filterFields?: Array<DataTableFilterField<TRequest>>,
) {
    return React.useMemo(
        () => filterFields?.filter((field) => field.type !== "select") ?? [],
        [filterFields],
    )
}

function useTableDraftState<TRequest extends DataTableRequestBase>(
    request: TRequest,
    setRequest: (updater: (previous: TRequest) => TRequest) => void,
    textFilterFields: Array<DataTableFilterField<TRequest>>,
    debounceMs: number,
) {
    const [searchDraft, setSearchDraft] = React.useState(request.query ?? "")
    const [textFilterDrafts, setTextFilterDrafts] = React.useState<Record<string, string>>({})

    React.useEffect(() => {
        setSearchDraft(request.query ?? "")
    }, [request.query])

    React.useEffect(() => {
        const nextDrafts = Object.fromEntries(
            textFilterFields.map((field) => {
                const value = getFilterValue(request, field.key)
                return [
                    field.key,
                    field.serializeValue
                        ? field.serializeValue(value)
                        : defaultSerializeValue(value),
                ]
            }),
        )
        setTextFilterDrafts(nextDrafts)
    }, [request, textFilterFields])

    React.useEffect(() => {
        if (searchDraft === (request.query ?? "")) return
        const timeoutId = window.setTimeout(() => {
            setRequest((previous) => {
                const next = {...previous}
                setReservedRequestField(next, "page", 0)
                setReservedRequestField(next, "query", searchDraft.trim() || undefined)
                return next
            })
        }, debounceMs)
        return () => window.clearTimeout(timeoutId)
    }, [debounceMs, request.query, searchDraft, setRequest])

    React.useEffect(() => {
        const hasChanges = textFilterFields.some((field) => {
            const currentValue = field.serializeValue
                ? field.serializeValue(getFilterValue(request, field.key))
                : defaultSerializeValue(getFilterValue(request, field.key))
            return (textFilterDrafts[field.key] ?? "") !== currentValue
        })

        if (!hasChanges) return

        const timeoutId = window.setTimeout(() => {
            setRequest((previous) => {
                const next = {...previous}
                setReservedRequestField(next, "page", 0)
                textFilterFields.forEach((field) => {
                    const rawValue = textFilterDrafts[field.key] ?? ""
                    const value = field.parseValue
                        ? field.parseValue(rawValue)
                        : defaultParseValue(
                            rawValue,
                            getFilterValue(previous, field.key),
                        )
                    setRequestField(next, field.key, value)
                })
                return next
            })
        }, debounceMs)

        return () => window.clearTimeout(timeoutId)
    }, [debounceMs, request, setRequest, textFilterDrafts, textFilterFields])

    return {
        searchDraft,
        setSearchDraft,
        textFilterDrafts,
        setTextFilterDrafts,
    }
}

function DataTable<
    TData,
    TValue = unknown,
    TRequest extends DataTableRequestBase = DataTableRequestBase,
>({
      columns,
      from,
      useQuery,
      useRowQuery,
      initialRequest,
      filterFields,
      searchPlaceholder = "Search...",
      emptyMessage = "No results.",
      pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
      debounceMs = 300,
      getRowId,
      toolbarActions,
      defaultQueryFields,
      className,
  }: DataTableProps<TData, TValue, TRequest>) {
    const {request, setRequest} = useDataTableQueryState<TRequest>({
        from,
        defaults: initialRequest,
        filterFields,
    })
    const query = useQuery({
        ...defaultQueryFields,
        ...request
    })
    const data = query.data
    const tableId = React.useId()
    const sorting = React.useMemo(
        () => getSortingStateFromRequest(columns, request.sort),
        [columns, request.sort],
    )
    const textFilterFields = useTextFilterFields(filterFields)
    const {
        searchDraft,
        setSearchDraft,
        textFilterDrafts,
        setTextFilterDrafts,
    } = useTableDraftState(request, setRequest, textFilterFields, debounceMs)

    const table = useReactTable<TableData<TData, any>>({
        data: data?.content ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: data?.totalPages ?? 0,
        getRowId,
        state: {
            sorting,
            pagination: {
                pageIndex: request.page ?? initialRequest?.page ?? 0,
                pageSize: request.size ?? initialRequest?.size ?? pageSizeOptions[0] ?? 10,
            },
        },
        onSortingChange: (updater) => {
            const nextSorting = resolveUpdater(updater, sorting)
            setRequest((previous) => {
                const next = {...previous}
                setReservedRequestField(next, "page", 0)
                setReservedRequestField(
                    next,
                    "sort",
                    nextSorting.length
                        ? nextSorting.map((item) => ({
                            field: getSortFieldByColumnId(columns, item.id),
                            direction: item.desc ? "DESC" : "ASC",
                        }))
                        : undefined,
                )
                return next
            })
        },
    })

    const currentPage = data?.number ?? request.page ?? 0
    const totalPages = data?.totalPages ?? 0
    const pageNumbers = makePaginationRange(currentPage, totalPages)
    const pageSize = request.size ?? initialRequest?.size ?? pageSizeOptions[0] ?? 10
    const hasRows = (data?.content?.length ?? 0) > 0
    const pageStart = hasRows ? currentPage * pageSize + 1 : 0
    const pageEnd = hasRows ? pageStart + (data?.content.length ?? 0) - 1 : 0

    return (
        <div className={cn("space-y-4", className)}>
            <DataTableToolbar
                filterFields={filterFields}
                request={request}
                searchDraft={searchDraft}
                textFilterDrafts={textFilterDrafts}
                searchPlaceholder={searchPlaceholder}
                toolbarActions={toolbarActions}
                isFetching={query.isFetching}
                onSearchDraftChange={setSearchDraft}
                onTextFilterDraftChange={(key, value) =>
                    setTextFilterDrafts((previous) => ({...previous, [key]: value}))
                }
                onSelectFilterChange={(field, nextValue) => {
                    setRequest((previous) => {
                        const next = {...previous}
                        setReservedRequestField(next, "page", 0)
                        const value =
                            nextValue === "__all__"
                                ? undefined
                                : field.parseValue
                                    ? field.parseValue(nextValue)
                                    : defaultParseValue(
                                        nextValue,
                                        getFilterValue(previous, field.key),
                                    )
                        setRequestField(next, field.key, value)
                        return next
                    })
                }}
                onRefresh={() => void query.refetch()}
                onClear={() => {
                    setSearchDraft("")
                    setTextFilterDrafts({})
                    setRequest((previous) => {
                        const next = {...previous}
                        setReservedRequestField(next, "query", undefined)
                        setReservedRequestField(next, "page", 0)
                        setReservedRequestField(next, "sort", undefined)
                        ;(filterFields ?? []).forEach((field) => {
                            setRequestField(next, field.key, undefined)
                        })
                        return next
                    })
                }}
            />

            <DataTableContent
                columns={columns}
                table={table}
                useRowQuery={useRowQuery}
                isLoading={query.isLoading}
                isError={query.isError}
                emptyMessage={emptyMessage}
                hasRows={hasRows}
            />

            <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={data?.totalElements ?? 0}
                pageNumbers={pageNumbers}
                pageSize={pageSize}
                pageSizeOptions={pageSizeOptions}
                hasRows={hasRows}
                pageStart={pageStart}
                pageEnd={pageEnd}
                tableId={tableId}
                onFirstPage={() =>
                    setRequest((previous) => {
                        const next = {...previous}
                        setReservedRequestField(next, "page", 0)
                        return next
                    })
                }
                onPreviousPage={() =>
                    setRequest((previous) => {
                        const next = {...previous}
                        setReservedRequestField(next, "page", Math.max((previous.page ?? 0) - 1, 0))
                        return next
                    })
                }
                onPageChange={(page) =>
                    setRequest((previous) => {
                        const next = {...previous}
                        setReservedRequestField(next, "page", page)
                        return next
                    })
                }
                onNextPage={() =>
                    setRequest((previous) => {
                        const next = {...previous}
                        setReservedRequestField(
                            next,
                            "page",
                            Math.min((previous.page ?? 0) + 1, Math.max(totalPages - 1, 0)),
                        )
                        return next
                    })
                }
                onLastPage={() =>
                    setRequest((previous) => {
                        const next = {...previous}
                        setReservedRequestField(next, "page", Math.max(totalPages - 1, 0))
                        return next
                    })
                }
                onPageSizeChange={(value) =>
                    setRequest((previous) => {
                        const next = {...previous}
                        setReservedRequestField(next, "page", 0)
                        setReservedRequestField(next, "size", Number(value))
                        return next
                    })
                }
            />
        </div>
    )
}

export * from "./types.ts"
export * from "./search-state.ts"
export default DataTable
