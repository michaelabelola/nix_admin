import {flexRender, type Row} from "@tanstack/react-table"
import {ArrowDown, ArrowUp, ArrowUpDown} from "lucide-react"

import {Button} from "@suiteonix/ui"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@suiteonix/ui"

import type {DataTableContentProps, TableData} from "./types.ts"
import {useEffect, useState} from "react";
import type {FetchError} from "@suiteonix/server";
import {Spinner} from "@suiteonix/ui";

export function DataTableContent<TData, TValue, T>({
                                                       columns,
                                                       table,
                                                       useRowQuery,
                                                       isLoading,
                                                       isError,
                                                       emptyMessage,
                                                       hasRows,
                                                   }: DataTableContentProps<TData, TValue, T>) {
    return (
        <div className="rounded-md border min-h-[20vh]">
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
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === "asc" ? (
                                                <ArrowUp className="size-4"/>
                                            ) : header.column.getIsSorted() === "desc" ? (
                                                <ArrowDown className="size-4"/>
                                            ) : (
                                                <ArrowUpDown className="size-4"/>
                                            )}
                                        </Button>
                                    ) : (
                                        flexRender(header.column.columnDef.header, header.getContext())
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-destructive">
                                Failed to load table data.
                            </TableCell>
                        </TableRow>
                    ) : hasRows ? (
                        table.getRowModel().rows.map((row) => (
                            useRowQuery ?
                                <RowView key={row.id} useRowQuery={useRowQuery} row={row}/>
                                :
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={"max-w-40 overflow-x-scroll whitespace-nowrap"}>
                                        {/*<TableCell key={cell.id} className={"max-w-40 overflow-x-scroll text-ellipsis whitespace-nowrap"}>*/}
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
    )
}

function RowView<TData, T>(props: {
    useRowQuery: (request: TableData<TData, T>) => Promise<T | any>,
    row: Row<TableData<TData, T>>
}) {
    const [data, setData] = useState<T>({} as T);
    const [status, setStatus] = useState("DEFAULT");
    useEffect(() => {
        props.useRowQuery({
            ...props.row.original,
            ...() => {
                setStatus("LOADING");
                return ({})
            }
        }).then(value => {
            setData(value);
            setStatus("SUCCESS");
        }).catch((reason: FetchError) => {
            console.error(reason.message);
            setStatus("ERROR");
        });
    }, [props.useRowQuery, props.row.original]);

    if (status === "LOADING") {
        return (
            <TableRow key={props.row.id} data-state={props.row.getIsSelected() && "selected"}>
                <TableCell><Spinner/></TableCell>
            </TableRow>
        )
    }

    if (status === "ERROR") {
        return (
            <TableRow key={props.row.id} data-state={props.row.getIsSelected() && "selected"}>
                <TableCell>Unable to get organization</TableCell>
            </TableRow>
        )
    }


    if (status === "SUCCESS")
        return (
            <TableRow key={props.row.id} data-state={props.row.getIsSelected() && "selected"}>
                {props.row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            {
                                ...cell.getContext(),
                                row: {
                                    ...cell.row,
                                    original: {
                                        ...cell.row.original,
                                        __computed: data,
                                    }
                                }
                            }
                        )}
                        {/*{flexRender(cell.column.columnDef.cell, cell.getContext())}*/}
                    </TableCell>
                ))}
            </TableRow>
        );
}

export default DataTableContent;