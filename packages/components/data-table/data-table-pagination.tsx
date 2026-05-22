import * as React from "react"

import {Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@suiteonix/ui"

import type {DataTablePaginationProps} from "./types.ts"

export function DataTablePagination({
                                        currentPage,
                                        totalPages,
                                        totalElements,
                                        pageNumbers,
                                        pageSize,
                                        pageSizeOptions,
                                        hasRows,
                                        pageStart,
                                        pageEnd,
                                        tableId,
                                        onFirstPage,
                                        onPreviousPage,
                                        onPageChange,
                                        onNextPage,
                                        onLastPage,
                                        onPageSizeChange,
                                    }: DataTablePaginationProps) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
                {hasRows
                    ? `Showing ${pageStart}-${pageEnd} of ${totalElements}`
                    : "No rows to display"}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page</span>
                    <Select value={String(pageSize)} onValueChange={onPageSizeChange}
                            disabled={((pageSize < pageSizeOptions[0]) && (currentPage === 1))}>
                        <SelectTrigger className="w-20">
                            <SelectValue/>
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
                        onClick={onFirstPage}
                        disabled={currentPage <= 0}
                    >
                        First
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onPreviousPage}
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
                                        onClick={() => onPageChange(page)}
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
                        onClick={onNextPage}
                        disabled={totalPages === 0 || currentPage >= totalPages - 1}
                    >
                        Next
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onLastPage}
                        disabled={totalPages === 0 || currentPage >= totalPages - 1}
                    >
                        Last
                    </Button>
                </div>
            </div>
        </div>
    )
}
