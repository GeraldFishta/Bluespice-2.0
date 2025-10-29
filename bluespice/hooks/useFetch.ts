// hooks/useFetch.ts
import useSWR, { type SWRConfiguration } from "swr";
import { fetcher } from "@/lib/swr-config";

export function useFetch<T = unknown>(
    url: string | null,
    options?: SWRConfiguration<T>
) {
    const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, options);

    return {
        data,
        error,
        isLoading,
        mutate,
    };
}
