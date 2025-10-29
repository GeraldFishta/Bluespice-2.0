// hooks/useFormErrors.ts
import { FieldErrors, FieldValues } from "react-hook-form";
import { useToast } from "./useToast";

export function useFormErrors<T extends FieldValues>() {
    const toast = useToast();

    const handleFormErrors = (errors: FieldErrors<T>) => {
        const firstError = Object.values(errors)[0];
        if (firstError?.message) {
            toast.error(firstError.message as string);
        } else {
            toast.error("Please fix the form errors");
        }
    };

    const handleServerError = (error: unknown) => {
        const err = error as { message?: string };
        toast.error(err.message || "An error occurred. Please try again.");
    };

    return {
        handleFormErrors,
        handleServerError,
    };
}
