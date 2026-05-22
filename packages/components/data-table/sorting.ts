import type {ColumnDef, ColumnSort} from "@tanstack/react-table"

import type {SortParam} from "#/models/PagedModel.ts"

export function flattenColumns<TData, TValue>(
  columns: Array<ColumnDef<TData, TValue>>,
): Array<ColumnDef<TData, TValue>> {
  return columns.flatMap((column) => {
    if ("columns" in column && Array.isArray(column.columns)) {
      return flattenColumns(column.columns as Array<ColumnDef<TData, TValue>>)
    }
    return [column]
  })
}

export function getColumnSortField<TData, TValue>(
  column: ColumnDef<TData, TValue>,
) {
  if ("meta" in column && column.meta?.sortField) return column.meta.sortField
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.accessorKey
  }
  if ("id" in column && typeof column.id === "string") return column.id
  return undefined
}

export function getSortingStateFromRequest<TData, TValue>(
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

export function getSortFieldByColumnId<TData, TValue>(
  columns: Array<ColumnDef<TData, TValue>>,
  columnId: string,
) {
  const column = flattenColumns(columns).find((item) => {
    if ("id" in item && item.id === columnId) return true
    return "accessorKey" in item && item.accessorKey === columnId
  })

  return column ? getColumnSortField(column) ?? columnId : columnId
}

export function makePaginationRange(currentPage: number, totalPages: number) {
  if (totalPages <= 1) return [0]

  const pages = new Set<number>([
    0,
    totalPages - 1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])

  return [...pages]
    .filter((page) => page >= 0 && page < totalPages)
    .sort((a, b) => a - b)
}
