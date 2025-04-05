import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Payment } from "@/constants/columns/payments";
import { SortingState } from "@tanstack/react-table";

interface PaymentsResponse {
    data: Payment[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export function usePayments(initialPageIndex = 0, initialPageSize = 10) {
    const [pageIndex, setPageIndex] = useState(initialPageIndex);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filter, setFilter] = useState("");

    // Build query parameters
    const params = new URLSearchParams({
        page: (pageIndex + 1).toString(), // API uses 1-based indexing
        pageSize: pageSize.toString(),
    });

    // Add sorting if specified
    if (sorting.length > 0) {
        const { id, desc } = sorting[0];
        params.append('sortBy', id);
        params.append('sortOrder', desc ? 'desc' : 'asc');
    }

    // Add filter if specified
    if (filter) {
        params.append('filter', filter);
    }

    // Query hook with all parameters
    const queryResult = useQuery<PaymentsResponse>({
        queryKey: ['payments', pageIndex, pageSize, sorting, filter],
        queryFn: async () => {
            const response = await fetch(`/api/payments?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Failed to fetch payments");
            }

            return response.json();
        },
    });

    // Handle pagination changes
    const onPaginationChange = (newPageIndex: number, newPageSize: number) => {
        setPageIndex(newPageIndex);
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize);
        }
    };

    // Handle sorting changes
    const onSortingChange = (newSorting: SortingState) => {
        setSorting(newSorting);
    };

    // Handle filter changes
    const onFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        // Reset to first page when filter changes
        setPageIndex(0);
    };

    return {
        ...queryResult,
        pageIndex,
        pageSize,
        sorting,
        filter,
        onPaginationChange,
        onSortingChange,
        onFilterChange,
    };
}