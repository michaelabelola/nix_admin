import * as React from "react"
import {useLocation, useNavigate} from "@tanstack/react-router"
import type {FileRoutesByTo} from "#/routeTree.gen.ts"

import type {SortParam} from "#/models/PagedModel.ts"

import {
  type DataTableFilterField,
  type DataTableRequestBase,
  type DataTableSearchOptions,
  type SearchRecord,
  type TableFilterValue,
  type Updater,
  getFilterValue,
  resolveUpdater,
  setRequestField,
  setReservedRequestField,
} from "./types.ts"

function parseInteger(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined
  }
  if (typeof value !== "string" || value.trim() === "") return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value
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
    ? values
        .map((value) => (typeof value === "string" ? value : undefined))
        .filter((value): value is string => value !== undefined)
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

export function defaultSerializeValue(value: TableFilterValue): string {
  return value == null ? "" : String(value)
}

export function defaultParseValue(
  value: string,
  sample?: TableFilterValue,
): TableFilterValue {
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

function getManagedFilterKeys<TRequest extends DataTableRequestBase>(
  filterFields?: Array<DataTableFilterField<TRequest>>,
  defaults?: Partial<TRequest>,
): string[] {
  const keys = new Set<string>()
  filterFields?.forEach((field) => keys.add(field.key))
  Object.keys(defaults ?? {}).forEach((key) => {
    if (!["query", "page", "size", "sort"].includes(key)) keys.add(key)
  })
  return [...keys]
}

function parseFilterValue<TRequest extends DataTableRequestBase>(
  key: string,
  search: SearchRecord,
  field?: DataTableFilterField<TRequest>,
  defaults?: Partial<TRequest>,
): TableFilterValue {
  const rawValue = search[key]
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return undefined
  }
  const normalizedValue = String(value)
  if (field?.parseValue) {
    return field.parseValue(normalizedValue) as TableFilterValue
  }
  return defaultParseValue(
    normalizedValue,
    defaults?.[key as keyof TRequest] as TableFilterValue,
  )
}

export function parseDataTableSearch<
  TRequest extends DataTableRequestBase = DataTableRequestBase,
>(
  search: SearchRecord,
  options: DataTableSearchOptions<TRequest> = {},
): TRequest {
  const {defaults, filterFields} = options
  const request = {
    ...(defaults ?? {}),
  } as TRequest

  if (typeof search.query === "string") {
    setReservedRequestField(request, "query", search.query || undefined)
  }

  const page = parseInteger(search.page)
  if (page !== undefined) setReservedRequestField(request, "page", page)

  const size = parseInteger(search.size)
  if (size !== undefined) setReservedRequestField(request, "size", size)

  const sort = parseSort(search.sort)
  if (sort !== undefined) setReservedRequestField(request, "sort", sort)
  if (search.sort == null && defaults?.sort) {
    setReservedRequestField(request, "sort", defaults.sort)
  }

  const filterKeySet = new Set(getManagedFilterKeys(filterFields, defaults))
  filterKeySet.forEach((key) => {
    const field = filterFields?.find((item) => item.key === key)
    const parsedValue = parseFilterValue(key, search, field, defaults)
    if (parsedValue !== undefined) {
      setRequestField(request, key as keyof TRequest, parsedValue)
      return
    }
    if (defaults && key in defaults) {
      setRequestField(request, key as keyof TRequest, defaults[key as keyof TRequest])
      return
    }
    delete (request as Record<string, unknown>)[key]
  })

  return request
}

export function buildDataTableSearch<
  TRequest extends DataTableRequestBase = DataTableRequestBase,
>(
  request: Partial<TRequest>,
  currentSearch: SearchRecord = {},
  options: DataTableSearchOptions<TRequest> = {},
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
    const value = getFilterValue(request, field.key)
    const serialized = field.serializeValue
      ? field.serializeValue(value)
      : defaultSerializeValue(value)
    if (serialized !== "") next[field.key] = serialized
  })

  const defaultManagedKeys = getManagedFilterKeys(undefined, options.defaults)
  defaultManagedKeys.forEach((key) => {
    if (options.filterFields?.some((field) => field.key === key)) return
    const value = request[key as keyof TRequest] as TableFilterValue
    const serialized = defaultSerializeValue(value)
    if (serialized !== "") next[key] = serialized
  })

  return next
}

function buildSearchParams(search: SearchRecord): URLSearchParams {
  const params = new URLSearchParams()
  Object.entries(search).forEach(([key, value]) => {
    if (value == null) return
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item != null) params.append(key, String(item))
      })
      return
    }
    params.set(key, String(value))
  })
  return params
}

export function useDataTableQueryState<
  TRequest extends DataTableRequestBase = DataTableRequestBase,
>({
  from,
  defaults,
  filterFields,
}: {
  from: keyof FileRoutesByTo
  defaults?: Partial<TRequest>
  filterFields?: Array<DataTableFilterField<TRequest>>
}) {
  const navigate = useNavigate({ from })
  const {pathname, search} = useLocation({
    select: (location) => ({
      pathname: location.pathname,
      search: location.search as SearchRecord,
    }),
  })

  const request = React.useMemo(
    () => parseDataTableSearch<TRequest>(search, {defaults, filterFields}),
    [defaults, filterFields, search],
  )

  const setRequest = React.useCallback(
    (updater: Updater<TRequest>) => {
      const nextRequest = resolveUpdater(updater, request)
      const nextSearch = buildDataTableSearch(nextRequest, search, {
        defaults,
        filterFields,
      })

      React.startTransition(() => {
        void navigate({
          to: pathname,
          search: nextSearch,
          replace: true,
        })
      })
    },
    [defaults, filterFields, navigate, pathname, request, search],
  )

  return {request, setRequest}
}
