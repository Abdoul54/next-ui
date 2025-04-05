"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { columns } from "@/constants/columns/payments";
import { RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePayments } from "@/hooks/use-payments";

export default function Page() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    pageIndex,
    pageSize,
    sorting,
    onPaginationChange,
    onSortingChange,
    onFilterChange,
  } = usePayments();

  return (
    <div className="container mx-auto p-4">
      <Card className="overflow-hidden rounded-lg">
        <CardHeader className="bg-card flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-xl">Server-Side Payments</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {isError && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive">
              <p>Error loading payments: {error?.message || "Unknown error"}</p>
            </div>
          )}

          <DataTable
            columns={columns}
            data={data?.data || []}
            pageCount={data?.pagination.totalPages || 0}
            pageSize={pageSize}
            pageIndex={pageIndex}
            isLoading={isLoading}
            onPaginationChange={onPaginationChange}
            onSortingChange={onSortingChange}
            onFilterChange={onFilterChange}
            filterColumn="email"
            sortingServer={sorting}
          />
        </CardContent>
      </Card>
    </div>
  );
}