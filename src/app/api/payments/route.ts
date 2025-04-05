import { Payments } from '@/data/Payments';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Extract pagination parameters from the URL
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

        // You would typically fetch data from a database here

        // Calculate pagination values
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const totalItems = Payments.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        // Slice the data according to pagination
        const payments = Payments.slice(startIndex, endIndex);

        // Return the data as JSON with pagination metadata
        return NextResponse.json({
            data: payments,
            pagination: {
                page,
                pageSize,
                totalItems,
                totalPages,
                hasMore: page < totalPages
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payments' },
            { status: 500 }
        );
    }
}