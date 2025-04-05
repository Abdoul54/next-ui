import { Payments } from '@/data/Payments';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Extract parameters from the URL
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
        const sortBy = searchParams.get('sortBy') || '';
        const sortOrder = searchParams.get('sortOrder') || 'asc';
        const filter = searchParams.get('filter') || '';

        // Create a copy of the payments data to work with
        let filteredData = [...Payments];

        // Apply filtering if a filter is specified
        if (filter) {
            const filterLower = filter.toLowerCase();
            filteredData = filteredData.filter(payment => {
                // Search through all fields that are strings
                return payment.email.toLowerCase().includes(filterLower) ||
                    payment.status.toLowerCase().includes(filterLower) ||
                    payment.id.toLowerCase().includes(filterLower);
            });
        }

        // Apply sorting if a sort field is specified
        if (sortBy) {
            filteredData.sort((a, b) => {
                const fieldA = a[sortBy as keyof typeof a];
                const fieldB = b[sortBy as keyof typeof b];

                // Handle string comparison
                if (typeof fieldA === 'string' && typeof fieldB === 'string') {
                    return sortOrder === 'asc'
                        ? fieldA.localeCompare(fieldB)
                        : fieldB.localeCompare(fieldA);
                }

                // Handle number comparison
                if (typeof fieldA === 'number' && typeof fieldB === 'number') {
                    return sortOrder === 'asc'
                        ? fieldA - fieldB
                        : fieldB - fieldA;
                }

                return 0;
            });
        }

        // Calculate pagination values
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Slice the data according to pagination
        const paginatedData = filteredData.slice(startIndex, endIndex);

        // Return the data as JSON with pagination metadata
        return NextResponse.json({
            data: paginatedData,
            pagination: {
                page,
                pageSize,
                totalItems,
                totalPages,
                hasMore: page < totalPages
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error processing payments:', error);
        return NextResponse.json(
            { error: 'Failed to process payments' },
            { status: 500 }
        );
    }
}