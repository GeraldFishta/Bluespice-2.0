// hooks/useFetch.ts
import useSWR from "swr";
import { fetcher } from "@/lib/swr-config";

export function useFetch<T = any>(url: string | null, options?: any) {
    const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, options);

    return {
        data,
        error,
        isLoading,
        mutate,
    };
}
