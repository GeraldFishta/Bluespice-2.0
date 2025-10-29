// utils/form-security.ts
import {
    sanitizeText,
    sanitizeEmail,
    sanitizeCurrency,
    sanitizePhone,
} from "@/lib/sanitization";

export const secureFormData = <T extends Record<string, unknown>>(
    formData: T
): T => {
    const secured = { ...formData } as Record<string, unknown>;

    for (const [key, value] of Object.entries(formData)) {
        switch (key.toLowerCase()) {
            case "email":
                secured[key] = sanitizeEmail(value as string);
                break;
            case "phone":
                secured[key] = sanitizePhone(value as string);
                break;
            case "salary":
            case "amount":
            case "deduction":
            case "bonus":
                secured[key] = sanitizeCurrency(value as string | number);
                break;
            default:
                if (typeof value === "string") {
                    secured[key] = sanitizeText(value);
                } else {
                    secured[key] = value;
                }
        }
    }

    return secured as T;
};

export const validateFormSecurity = <T extends Record<string, unknown>>(
    formData: T
): Record<string, string> | null => {
    const errors: Record<string, string> = {};

    // Check for potential XSS
    const xssPattern = /<script|javascript:|on\w+=/i;
    for (const [key, value] of Object.entries(formData)) {
        if (typeof value === "string" && xssPattern.test(value)) {
            errors[key] = "Invalid characters detected";
        }
    }

    // Check for SQL injection patterns (basic check)
    const sqlPattern = /('|(\\')|(;)|(--)|(\/\*)|(\*\/)|(\|)|(&)|(%))/i;
    for (const [key, value] of Object.entries(formData)) {
        if (typeof value === "string" && sqlPattern.test(value)) {
            errors[key] = "Invalid characters detected";
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
};
