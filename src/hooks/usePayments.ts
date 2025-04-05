"use client"

import { useQuery } from "@tanstack/react-query"

export const usePayments = () => {
    return useQuery({
        queryKey: ["payments"],
        queryFn: async () => {
            const res = await fetch("/api/payments")
            if (!res.ok) {
                throw new Error("Network response was not ok")
            }
            return res.json()
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,

    })

}
