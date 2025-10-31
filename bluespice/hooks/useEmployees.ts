// hooks/useEmployees.ts
"use client";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import { useToast } from "./useToast";
import { employeesCache } from "@/lib/cache";

export interface Employee {
    id: string;
    profile_id?: string; // optional when reading from view
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

// Filter/sort/pagination params for list
type EmployeeFilters = {
    search?: string;
    status?: "all" | "active" | "inactive" | "terminated";
    employmentType?: "all" | "full-time" | "part-time" | "contract";
    sort?: string; // e.g., 'created_at' | 'employee_id'
    dir?: "asc" | "desc";
    page?: number;
    pageSize?: number;
};

// SWR key generator to avoid overfetch and ensure cache correctness
const employeesKey = (p: EmployeeFilters) => [
    "employees",
    p.search || "",
    p.status || "all",
    p.employmentType || "all",
    p.sort || "created_at",
    p.dir || "desc",
    p.page || 1,
    p.pageSize || 20,
];

// Supabase fetcher for employees with filters/pagination (reads from view)
const fetchEmployeesWithParams = async (p: EmployeeFilters): Promise<{ data: Employee[]; count: number | null; }> => {
    const {
        search,
        status = "all",
        employmentType = "all",
        sort = "created_at",
        dir = "desc",
        page = 1,
        pageSize = 20,
    } = p;

    let q = supabase.from("employee_dto_v1").select("*", { count: "exact" });

    if (search) {
        q = q.or(
            `employee_id.ilike.%${search}%,` +
            `profile->>first_name.ilike.%${search}%,` +
            `profile->>last_name.ilike.%${search}%,` +
            `profile->>email.ilike.%${search}%`
        );
    }
    if (status !== "all") q = q.eq("status", status);
    if (employmentType !== "all") q = q.eq("employment_type", employmentType);

    q = q.order(sort, { ascending: dir === "asc" });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    q = q.range(from, to);

    const { data, error, count } = await q;
    if (error) throw error;
    return { data: (data as Employee[]) || [], count: count ?? null };
};

export function useEmployees(params: EmployeeFilters = {}) {
    const toast = useToast();
    const key = employeesKey(params);
    const { data, isLoading, error, mutate: refetch } = useSWR<{ data: Employee[]; count: number | null }>(
        key,
        () => fetchEmployeesWithParams(params),
        { revalidateOnFocus: false }
    );

    const createEmployee = async (employeeData: EmployeeCreateData) => {
        try {
            const { data, error } = await supabase
                .from("employees")
                .insert(employeeData)
                .select()
                .single();

            if (error) throw error;

            // Invalidate all employees caches
            employeesCache.invalidateEmployeeLists();
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

            // Invalidate employee cache (both detail and lists)
            employeesCache.invalidateEmployee(id);
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

            // Invalidate all employees caches
            employeesCache.invalidateEmployeeLists();
            toast.success("Employee deleted successfully!");
            return { success: true };
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || "Failed to delete employee");
            return { success: false, error: err.message };
        }
    };

    return {
        employees: data?.data || [],
        total: data?.count ?? null,
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
            .from("employee_dto_v1")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return (data as Employee) || null;
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
