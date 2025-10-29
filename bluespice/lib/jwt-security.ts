// lib/jwt-security.ts
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
    exp: number;
    iss: string;
    aud: string;
    [key: string]: unknown;
}

export const validateJWT = (token: string | null): boolean => {
    try {
        if (!token) return false;

        const decoded = jwtDecode<JWTPayload>(token);
        const now = Date.now() / 1000;

        // Check expiration
        if (decoded.exp < now) {
            console.warn("JWT token expired");
            return false;
        }

        // Check issuer
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl && decoded.iss !== supabaseUrl) {
            console.warn("Invalid JWT issuer");
            return false;
        }

        // Check audience
        if (decoded.aud !== "authenticated") {
            console.warn("Invalid JWT audience");
            return false;
        }

        return true;
    } catch (error) {
        console.error("JWT validation error:", error);
        return false;
    }
};

export const getJWTPayload = <T extends JWTPayload = JWTPayload>(
    token: string | null
): T | null => {
    try {
        if (!token) return null;
        return jwtDecode<T>(token);
    } catch {
        return null;
    }
};

export const isTokenExpiringSoon = (
    token: string | null,
    minutesThreshold = 5
): boolean => {
    try {
        if (!token) return true;

        const decoded = jwtDecode<JWTPayload>(token);
        const now = Date.now() / 1000;
        const expirationTime = decoded.exp;
        const threshold = minutesThreshold * 60;

        return expirationTime - now < threshold;
    } catch {
        return true;
    }
};
