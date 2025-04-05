'use client'

import React, { useState, useMemo } from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

/**
 * DataTable component for displaying tabular data with sorting and pagination.
 * 
 * @param {Array} columns - Array of column definitions.
 * @param {Array} data - Array of data objects to be displayed in the table.
 * @returns {JSX.Element} Rendered DataTable component.
 */
interface DataTableProps<TData, TValue> {
    columns: (ColumnDef<TData, TValue> | {
        accessorKey: string;
        header: string;
    })[]
    data: TData[]
}

export default function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])

    // Transform simplified column definitions into full ColumnDef objects
    const processedColumns = useMemo(() => {
        return columns.map(col => {
            // If it's already a full ColumnDef, return it as is
            if ('cell' in col) return col as ColumnDef<TData, TValue>;

            // Otherwise, create a ColumnDef with default cell renderer
            const simplifiedCol = col as { accessorKey: string; header: string };
            return {
                accessorKey: simplifiedCol.accessorKey,
                header: simplifiedCol.header,
                cell: (info) => info.getValue() as React.ReactNode
            } as ColumnDef<TData, TValue>;
        });
    }, [columns]);

    const table = useReactTable({
        data,
        columns: processedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
