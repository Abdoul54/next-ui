import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const QueryProvider = ({ children }: React.PropsWithChildren<{
    children: React.ReactNode;
}>) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
                staleTime: 1000 * 60 * 5, // 5 minutes
            },
        },
    });
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default QueryProvider;