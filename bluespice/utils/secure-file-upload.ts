// utils/secure-file-upload.ts
import { sanitizeText } from "@/lib/sanitization";

export const validateFileType = (
    file: File,
    allowedTypes: string[] = [".csv", ".xlsx", ".pdf"]
): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    return allowedTypes.includes(fileExtension);
};

export const validateFileSize = (file: File, maxSizeMB = 10): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

export const sanitizeFileName = (fileName: string): string => {
    return fileName
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_{2,}/g, "_")
        .substring(0, 100); // Limit length
};

export const createSecureFormData = (
    file: File,
    additionalData: Record<string, unknown> = {}
): FormData => {
    const formData = new FormData();

    // Sanitize filename
    const sanitizedFile = new File([file], sanitizeFileName(file.name), {
        type: file.type,
    });

    formData.append("file", sanitizedFile);

    // Add additional sanitized data
    Object.entries(additionalData).forEach(([key, value]) => {
        if (typeof value === "string") {
            formData.append(key, sanitizeText(value));
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
};
