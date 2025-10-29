// lib/sanitization.ts
import DOMPurify from "dompurify";

// Configure DOMPurify for strict sanitization
const sanitizeConfig: DOMPurify.Config = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
};

export const sanitizeHTML = (dirty: string): string => {
    if (typeof window === "undefined") return dirty;
    return DOMPurify.sanitize(dirty, sanitizeConfig);
};

export const sanitizeText = (text: string | null | undefined): string => {
    if (typeof text !== "string") return "";

    return text
        .replace(/[<>]/g, "") // Remove < and >
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+=/gi, "") // Remove event handlers
        .trim();
};

export const sanitizeEmail = (email: string | null | undefined): string => {
    if (typeof email !== "string") return "";

    return email
        .toLowerCase()
        .replace(/[^a-z0-9@._-]/g, "") // Keep only valid email characters
        .trim();
};

export const sanitizePhone = (phone: string | null | undefined): string => {
    if (typeof phone !== "string") return "";

    return phone
        .replace(/[^\d+\-()\s]/g, "") // Keep only valid phone characters
        .trim();
};

export const sanitizeCurrency = (
    amount: string | number | null | undefined
): number => {
    if (typeof amount === "number") return Math.max(0, amount);
    if (typeof amount !== "string") return 0;

    // Remove currency symbols and non-numeric characters except decimal point
    const cleaned = amount.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : Math.max(0, parsed);
};
