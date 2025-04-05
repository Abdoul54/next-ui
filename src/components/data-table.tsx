"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState, useEffect } from "react"
import { Input } from "./ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { Button } from "./ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Loader2Icon 
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageSize: number
  pageIndex: number
  isLoading: boolean
  filterColumn?: string // Column to filter on
  sortingServer?: SortingState
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  onSortingChange?: (sorting: SortingState) => void
  onFilterChange?: (filter: string) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageSize,
  pageIndex,
  isLoading,
  filterColumn,
  sortingServer,
  onPaginationChange,
  onSortingChange,
  onFilterChange,
}: DataTableProps<TData, TValue>) {
  // Local table state
  const [sorting, setSorting] = useState<SortingState>(sortingServer || [])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filter, setFilter] = useState("")
  
  // Handle changes to sorting
  useEffect(() => {
    if (onSortingChange) {
      onSortingChange(sorting)
    }
  }, [sorting, onSortingChange])

  // Handle changes to filter
  useEffect(() => {
    if (onFilterChange) {
      const timeoutId = setTimeout(() => {
        onFilterChange(filter)
      }, 300) // Debounce to avoid too many requests
      
      return () => clearTimeout(timeoutId)
    }
  }, [filter, onFilterChange])

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,  // Tell the table we're handling pagination server-side
    manualSorting: Boolean(onSortingChange), // Tell the table we're handling sorting server-side
    manualFiltering: Boolean(onFilterChange), // Tell the table we're handling filtering server-side
    enableMultiSort: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div>
      {filterColumn && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
          />
          <DataTableViewOptions table={table} />
        </div>
      )}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPaginationChange(0, Number(value))
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pageIndex + 1} of {pageCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(0, pageSize)}
            disabled={pageIndex === 0 || isLoading}
            className="hidden sm:inline-flex h-8 w-8 p-0"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(pageIndex - 1, pageSize)}
            disabled={pageIndex === 0 || isLoading}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(pageIndex + 1, pageSize)}
            disabled={pageIndex >= pageCount - 1 || isLoading}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(pageCount - 1, pageSize)}
            disabled={pageIndex >= pageCount - 1 || isLoading}
            className="hidden sm:inline-flex h-8 w-8 p-0"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
