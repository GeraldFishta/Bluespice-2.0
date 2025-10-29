// lib/swr-config.ts
import api from "./axios";

export const fetcher = async (url: string) => {
    const { data } = await api.get(url);
    return data;
};

export const swrConfig = {
    fetcher,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
};
