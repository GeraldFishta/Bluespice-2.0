// hooks/useEmployees.ts
"use client";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import { mutate } from "swr";
import { useToast } from "./useToast";

export interface Employee {
    id: string;
    profile_id: string;
    employee_id: string;
    salary: number;
    hourly_rate: number | null;
    employment_type: "full-time" | "part-time" | "contract";
    status: "active" | "inactive" | "terminated";
    manager_id: string | null;
    created_at: string;
    updated_at: string;
    // Joined with profiles
    profile?: {
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        department: string | null;
        position: string | null;
        hire_date: string | null;
    };
}

interface EmployeeCreateData {
    profile_id: string;
    employee_id: string;
    salary: number;
    hourly_rate?: number;
    employment_type: "full-time" | "part-time" | "contract";
    status?: "active" | "inactive" | "terminated";
    manager_id?: string;
}

interface EmployeeUpdateData {
    employee_id?: string;
    salary?: number;
    hourly_rate?: number | null;
    employment_type?: "full-time" | "part-time" | "contract";
    status?: "active" | "inactive" | "terminated";
    manager_id?: string;
}

// SWR key for employees list
const EMPLOYEES_KEY = "employees";

// Supabase fetcher for employees
const fetchEmployees = async (): Promise<Employee[]> => {
    const { data, error } = await supabase
        .from("employees")
        .select(
            `
      *,
      profile:profiles!profile_id (
        first_name,
        last_name,
        email,
        role,
        department,
        position,
        hire_date
      )
    `
        )
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
};

export function useEmployees() {
    const toast = useToast();
    const { data: employees, isLoading, error, mutate: refetch } = useSWR<Employee[]>(
        EMPLOYEES_KEY,
        fetchEmployees,
        {
            revalidateOnFocus: false,
        }
    );

    const createEmployee = async (employeeData: EmployeeCreateData) => {
        try {
            const { data, error } = await supabase
                .from("employees")
                .insert(employeeData)
                .select()
                .single();

            if (error) throw error;

            // Invalidate cache
            mutate(EMPLOYEES_KEY);
            toast.success("Employee created successfully!");
            return { success: true, data };
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || "Failed to create employee");
            return { success: false, error: err.message };
        }
    };

    const updateEmployee = async (id: string, employeeData: EmployeeUpdateData) => {
        try {
            const { data, error } = await supabase
                .from("employees")
                .update(employeeData)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;

            // Invalidate cache
            mutate(EMPLOYEES_KEY);
            toast.success("Employee updated successfully!");
            return { success: true, data };
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || "Failed to update employee");
            return { success: false, error: err.message };
        }
    };

    const deleteEmployee = async (id: string) => {
        try {
            const { error } = await supabase.from("employees").delete().eq("id", id);

            if (error) throw error;

            // Invalidate cache
            mutate(EMPLOYEES_KEY);
            toast.success("Employee deleted successfully!");
            return { success: true };
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || "Failed to delete employee");
            return { success: false, error: err.message };
        }
    };

    return {
        employees: employees || [],
        isLoading,
        error,
        mutate: refetch,
        createEmployee,
        updateEmployee,
        deleteEmployee,
    };
}

// Hook for single employee
export function useEmployee(id: string | null) {
    const fetchEmployee = async (): Promise<Employee | null> => {
        if (!id) return null;

        const { data, error } = await supabase
            .from("employees")
            .select(
                `
        *,
      profile:profiles!profile_id (
          first_name,
          last_name,
          email,
          role,
          department,
          position,
          hire_date
        )
      `
            )
            .eq("id", id)
            .single();

        if (error) throw error;
        return data || null;
    };

    const { data: employee, isLoading, error } = useSWR<Employee | null>(
        id ? `employee-${id}` : null,
        fetchEmployee
    );

    return {
        employee: employee || null,
        isLoading,
        error,
    };
}
