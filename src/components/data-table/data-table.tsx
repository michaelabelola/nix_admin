import * as React from "react"
import {useNavigate, useSearch} from "@tanstack/react-router"
import type {UseQueryResult} from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnSort,
  type RowData,
} from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  RefreshCw,
  Search,
  X,
} from "lucide-react"

import type {Paged, PagedRequest, SortParam} from "#/models/PagedModel.ts"
import {cn} from "#/lib/utils.ts"
import {Button} from "#/components/ui/button.tsx"
import {Input} from "#/components/ui/input.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table.tsx"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    sortField?: string
  }
}

type Primitive = string | number | boolean
type TableFilterValue = Primitive | null | undefined
type TableRequestFilters = Record<string, TableFilterValue>
type SearchRecord = Record<string, unknown>
type Updater<T> = T | ((prev: T) => T)

export type DataTableFilterField<
  TFilters extends TableRequestFilters = TableRequestFilters,
> = {
  key: Extract<keyof TFilters, string>
  label?: string
  placeholder?: string
  type?: "text" | "select"
  options?: Array<{
    label: string
    value: string
  }>
  parseValue?: (value: string) => TFilters[Extract<keyof TFilters, string>] | undefined
  serializeValue?: (value: TFilters[Extract<keyof TFilters, string>] | undefined) => string
}

type DataTableSearchOptions<TFilters extends TableRequestFilters> = {
  defaults?: Partial<PagedRequest<TFilters>>
  filterFields?: Array<DataTableFilterField<TFilters>>
}

export type DataTableProps<
  TData,
  TValue = unknown,
  TFilters extends TableRequestFilters = Record<string, never>,
> = {
  columns: Array<ColumnDef<TData, TValue>>
  from: string
  useQuery: (request: PagedRequest<TFilters>) => UseQueryResult<Paged<TData>>
  initialRequest?: Partial<PagedRequest<TFilters>>
  filterFields?: Array<DataTableFilterField<TFilters>>
  searchPlaceholder?: string
  emptyMessage?: string
  pageSizeOptions?: number[]
  debounceMs?: number
  getRowId?: Parameters<typeof useReactTable<TData>>[0]["getRowId"]
  toolbarActions?: React.ReactNode
  className?: string
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === "function"
    ? (updater as (prev: T) => T)(previous)
    : updater
}

function parseInteger(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseBoolean(value: unknown): boolean | undefined {
  if (value === "true") return true
  if (value === "false") return false
  return undefined
}

function parseSortValue(value: string): SortParam | undefined {
  const [field, direction] = value.split(",")
  if (!field) return undefined
  if (direction !== "ASC" && direction !== "DESC") return undefined
  return {field, direction}
}

function parseSort(values: unknown): SortParam[] | undefined {
  const rawValues = Array.isArray(values)
    ? values.filter((value): value is string => typeof value === "string")
    : typeof values === "string"
      ? [values]
      : []

  const parsed = rawValues
    .map(parseSortValue)
    .filter((value): value is SortParam => value !== undefined)

  return parsed.length > 0 ? parsed : undefined
}

function serializeSort(sort?: SortParam[]): string[] | undefined {
  if (!sort?.length) return undefined
  return sort.map((item) => `${item.field},${item.direction}`)
}

function defaultSerializeValue(value: TableFilterValue): string {
  return value == null ? "" : String(value)
}

function defaultParseValue(value: string, sample?: TableFilterValue): TableFilterValue {
  if (value === "") return undefined
  if (typeof sample === "number") {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  if (typeof sample === "boolean") {
    return parseBoolean(value)
  }
  return value
}

function getManagedFilterKeys<TFilters extends TableRequestFilters>(
  filterFields?: Array<DataTableFilterField<TFilters>>,
  defaults?: Partial<PagedRequest<TFilters>>,
): string[] {
  const keys = new Set<string>()
  filterFields?.forEach((field) => keys.add(field.key))
  Object.keys(defaults ?? {}).forEach((key) => {
    if (!["query", "page", "size", "sort"].includes(key)) keys.add(key)
  })
  return [...keys]
}

function parseFilterValue<TFilters extends TableRequestFilters>(
  key: string,
  search: SearchRecord,
  field?: DataTableFilterField<TFilters>,
  defaults?: Partial<PagedRequest<TFilters>>,
): TableFilterValue {
  const rawValue = search[key]
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue
  if (typeof value !== "string") return undefined
  if (field?.parseValue) return field.parseValue(value) as TableFilterValue
  return defaultParseValue(value, defaults?.[key as keyof typeof defaults] as TableFilterValue)
}

export function parseDataTableSearch<
  TFilters extends TableRequestFilters = Record<string, never>,
>(
  search: SearchRecord,
  options: DataTableSearchOptions<TFilters> = {},
): PagedRequest<TFilters> {
  const {defaults, filterFields} = options
  const request: PagedRequest<TFilters> = {
    ...defaults,
  }

  if (typeof search.query === "string") {
    request.query = search.query || undefined
  }

  const page = parseInteger(search.page)
  if (page !== undefined) request.page = page

  const size = parseInteger(search.size)
  if (size !== undefined) request.size = size

  const sort = parseSort(search.sort)
  if (sort !== undefined) request.sort = sort
  if (search.sort == null && defaults?.sort) request.sort = defaults.sort

  const filterKeySet = new Set(
    getManagedFilterKeys(filterFields, defaults),
  )

  filterKeySet.forEach((key) => {
    const field = filterFields?.find((item) => item.key === key)
    const parsedValue = parseFilterValue(key, search, field, defaults)
    if (parsedValue !== undefined) {
      ;(request as Record<string, unknown>)[key] = parsedValue
      return
    }
    if (defaults && key in defaults) {
      ;(request as Record<string, unknown>)[key] =
        defaults[key as keyof typeof defaults]
      return
    }
    delete (request as Record<string, unknown>)[key]
  })

  return request
}

export function buildDataTableSearch<
  TFilters extends TableRequestFilters = Record<string, never>,
>(
  request: PagedRequest<TFilters>,
  currentSearch: SearchRecord = {},
  options: DataTableSearchOptions<TFilters> = {},
): SearchRecord {
  const next: SearchRecord = {...currentSearch}
  const managedKeys = new Set([
    "query",
    "page",
    "size",
    "sort",
    ...getManagedFilterKeys(options.filterFields, options.defaults),
  ])

  managedKeys.forEach((key) => {
    delete next[key]
  })

  if (request.query) next.query = request.query
  if (request.page != null) next.page = request.page
  if (request.size != null) next.size = request.size

  const sort = serializeSort(request.sort)
  if (sort?.length) next.sort = sort.length === 1 ? sort[0] : sort

  options.filterFields?.forEach((field) => {
    const value = request[field.key]
    const serialized = field.serializeValue
      ? field.serializeValue(value)
      : defaultSerializeValue(value)
    if (serialized !== "") next[field.key] = serialized
  })

  const defaultManagedKeys = getManagedFilterKeys(undefined, options.defaults)
  defaultManagedKeys.forEach((key) => {
    if (options.filterFields?.some((field) => field.key === key)) return
    const value = request[key as keyof typeof request] as TableFilterValue
    const serialized = defaultSerializeValue(value)
    if (serialized !== "") next[key] = serialized
  })

  return next
}

export function useDataTableQueryState<
  TFilters extends TableRequestFilters = Record<string, never>,
>({
  from,
  defaults,
  filterFields,
}: {
  from: string
  defaults?: Partial<PagedRequest<TFilters>>
  filterFields?: Array<DataTableFilterField<TFilters>>
}) {
  const search = useSearch({from, strict: false}) as SearchRecord
  const navigate = useNavigate({from})

  const request = React.useMemo(
    () => parseDataTableSearch<TFilters>(search, {defaults, filterFields}),
    [defaults, filterFields, search],
  )

  const setRequest = React.useCallback(
    (updater: Updater<PagedRequest<TFilters>>) => {
      const nextRequest = resolveUpdater(updater, request)

      React.startTransition(() => {
        void navigate({
          search: (previous) =>
            buildDataTableSearch(nextRequest, previous as SearchRecord, {
              defaults,
              filterFields,
            }),
          replace: true,
        })
      })
    },
    [defaults, filterFields, navigate, request],
  )

  return {request, setRequest}
}

function flattenColumns<TData, TValue>(
  columns: Array<ColumnDef<TData, TValue>>,
): Array<ColumnDef<TData, TValue>> {
  return columns.flatMap((column) => {
    if ("columns" in column && Array.isArray(column.columns)) {
      return flattenColumns(column.columns as Array<ColumnDef<TData, TValue>>)
    }
    return [column]
  })
}

function getColumnSortField<TData, TValue>(column: ColumnDef<TData, TValue>) {
  if ("meta" in column && column.meta?.sortField) return column.meta.sortField
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.accessorKey
  }
  if ("id" in column && typeof column.id === "string") return column.id
  return undefined
}

function getSortingStateFromRequest<TData, TValue>(
  columns: Array<ColumnDef<TData, TValue>>,
  sort?: SortParam[],
): ColumnSort[] {
  if (!sort?.length) return []

  const fieldToColumnId = new Map<string, string>()

  flattenColumns(columns).forEach((column) => {
    const sortField = getColumnSortField(column)
    if (!sortField) return
    const columnId =
      ("id" in column && typeof column.id === "string" && column.id) ||
      ("accessorKey" in column && typeof column.accessorKey === "string"
        ? column.accessorKey
        : sortField)
    fieldToColumnId.set(sortField, columnId)
  })

  return sort.map((item) => ({
    id: fieldToColumnId.get(item.field) ?? item.field,
    desc: item.direction === "DESC",
  }))
}

function getSortFieldByColumnId<TData, TValue>(
  columns: Array<ColumnDef<TData, TValue>>,
  columnId: string,
) {
  const column = flattenColumns(columns).find((item) => {
    if ("id" in item && item.id === columnId) return true
    return "accessorKey" in item && item.accessorKey === columnId
  })

  return column ? getColumnSortField(column) ?? columnId : columnId
}

function makePaginationRange(currentPage: number, totalPages: number) {
  if (totalPages <= 1) return [0]

  const pages = new Set<number>([0, totalPages - 1, currentPage - 1, currentPage, currentPage + 1])

  return [...pages]
    .filter((page) => page >= 0 && page < totalPages)
    .sort((a, b) => a - b)
}

export function DataTable<
  TData,
  TValue = unknown,
  TFilters extends TableRequestFilters = Record<string, never>,
>({
  columns,
  from,
  useQuery,
  initialRequest,
  filterFields,
  searchPlaceholder = "Search...",
  emptyMessage = "No results.",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  debounceMs = 300,
  getRowId,
  toolbarActions,
  className,
}: DataTableProps<TData, TValue, TFilters>) {
  const {request, setRequest} = useDataTableQueryState<TFilters>({
    from,
    defaults: initialRequest,
    filterFields,
  })

  const query = useQuery(request)
  const data = query.data
  const tableId = React.useId()

  const sorting = React.useMemo(
    () => getSortingStateFromRequest(columns, request.sort),
    [columns, request.sort],
  )

  const [searchDraft, setSearchDraft] = React.useState(request.query ?? "")
  const textFilterFields = React.useMemo(
    () => filterFields?.filter((field) => field.type !== "select") ?? [],
    [filterFields],
  )
  const [textFilterDrafts, setTextFilterDrafts] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    setSearchDraft(request.query ?? "")
  }, [request.query])

  React.useEffect(() => {
    const nextDrafts = Object.fromEntries(
      textFilterFields.map((field) => [
        field.key,
        field.serializeValue
          ? field.serializeValue(request[field.key])
          : defaultSerializeValue(request[field.key]),
      ]),
    )
    setTextFilterDrafts(nextDrafts)
  }, [request, textFilterFields])

  React.useEffect(() => {
    if (searchDraft === (request.query ?? "")) return
    const timeoutId = window.setTimeout(() => {
      setRequest((previous) => ({
        ...previous,
        page: 0,
        query: searchDraft.trim() || undefined,
      }))
    }, debounceMs)
    return () => window.clearTimeout(timeoutId)
  }, [debounceMs, request.query, searchDraft, setRequest])

  React.useEffect(() => {
    const hasChanges = textFilterFields.some((field) => {
      const currentValue = field.serializeValue
        ? field.serializeValue(request[field.key])
        : defaultSerializeValue(request[field.key])
      return (textFilterDrafts[field.key] ?? "") !== currentValue
    })

    if (!hasChanges) return

    const timeoutId = window.setTimeout(() => {
      setRequest((previous) => {
        const next = {...previous, page: 0}
        textFilterFields.forEach((field) => {
          const rawValue = textFilterDrafts[field.key] ?? ""
          const value = field.parseValue
            ? field.parseValue(rawValue)
            : defaultParseValue(rawValue, previous[field.key]) as TFilters[Extract<keyof TFilters, string>] | undefined

          ;(next as Record<string, unknown>)[field.key] = value
        })
        return next
      })
    }, debounceMs)

    return () => window.clearTimeout(timeoutId)
  }, [debounceMs, request, setRequest, textFilterDrafts, textFilterFields])

  const table = useReactTable({
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
      setRequest((previous) => ({
        ...previous,
        page: 0,
        sort: nextSorting.length
          ? nextSorting.map((item) => ({
              field: getSortFieldByColumnId(columns, item.id),
              direction: item.desc ? "DESC" : "ASC",
            }))
          : undefined,
      }))
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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
              aria-label="Search table"
            />
          </div>
          {filterFields?.map((field) => {
            if (field.type === "select") {
              const value = field.serializeValue
                ? field.serializeValue(request[field.key])
                : defaultSerializeValue(request[field.key])
              return (
                <Select
                  key={field.key}
                  value={value || "__all__"}
                  onValueChange={(nextValue) => {
                    setRequest((previous) => ({
                      ...previous,
                      page: 0,
                      [field.key]:
                        nextValue === "__all__"
                          ? undefined
                          : field.parseValue
                            ? field.parseValue(nextValue)
                            : defaultParseValue(
                                nextValue,
                                previous[field.key],
                              ),
                    }))
                  }}
                >
                  <SelectTrigger className="min-w-0">
                    <SelectValue placeholder={field.placeholder ?? field.label ?? field.key} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All</SelectItem>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }

            return (
              <Input
                key={field.key}
                value={textFilterDrafts[field.key] ?? ""}
                onChange={(event) =>
                  setTextFilterDrafts((previous) => ({
                    ...previous,
                    [field.key]: event.target.value,
                  }))
                }
                placeholder={field.placeholder ?? field.label ?? field.key}
                aria-label={field.label ?? field.key}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-end gap-2">
          {toolbarActions}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw className={cn("size-4", query.isFetching && "animate-spin")} />
            Refresh
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchDraft("")
              setTextFilterDrafts({})
              setRequest((previous) => ({
                ...previous,
                query: undefined,
                page: 0,
                sort: undefined,
                ...Object.fromEntries(
                  (filterFields ?? []).map((field) => [field.key, undefined]),
                ),
              }))
            }}
          >
            <X className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUp className="size-4" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown className="size-4" />
                        ) : (
                          <ArrowUpDown className="size-4" />
                        )}
                      </Button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {query.isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : query.isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-destructive">
                  Failed to load table data.
                </TableCell>
              </TableRow>
            ) : hasRows ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          {hasRows
            ? `Showing ${pageStart}-${pageEnd} of ${data?.totalElements ?? 0}`
            : "No rows to display"}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) =>
                setRequest((previous) => ({
                  ...previous,
                  page: 0,
                  size: Number(value),
                }))
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRequest((previous) => ({...previous, page: 0}))}
              disabled={currentPage <= 0}
            >
              First
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setRequest((previous) => ({
                  ...previous,
                  page: Math.max((previous.page ?? 0) - 1, 0),
                }))
              }
              disabled={currentPage <= 0}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((page, index) => {
                const previousPage = pageNumbers[index - 1]
                return (
                  <React.Fragment key={`${tableId}-${page}`}>
                    {previousPage != null && page - previousPage > 1 ? (
                      <span className="px-2 text-sm text-muted-foreground">...</span>
                    ) : null}
                    <Button
                      type="button"
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setRequest((previous) => ({...previous, page}))
                      }
                    >
                      {page + 1}
                    </Button>
                  </React.Fragment>
                )
              })}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setRequest((previous) => ({
                  ...previous,
                  page: Math.min((previous.page ?? 0) + 1, Math.max(totalPages - 1, 0)),
                }))
              }
              disabled={totalPages === 0 || currentPage >= totalPages - 1}
            >
              Next
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setRequest((previous) => ({
                  ...previous,
                  page: Math.max(totalPages - 1, 0),
                }))
              }
              disabled={totalPages === 0 || currentPage >= totalPages - 1}
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
