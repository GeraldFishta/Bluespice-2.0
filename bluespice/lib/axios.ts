// lib/axios.ts
import axios from "axios";
import { supabase } from "./supabase";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for JWT
api.interceptors.request.use(
    async (config) => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token invalid or expired - logout
            await supabase.auth.signOut();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        if (error.response?.status === 403) {
            console.warn("Access forbidden to resource");
        }

        if (error.response?.status === 429) {
            console.warn("Rate limited - too many requests");
        }

        return Promise.reject(error);
    }
);

export default api;
