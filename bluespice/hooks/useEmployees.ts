// hooks/useEmployees.ts
/**
 * Hook for employee data fetching only
 * For mutations (create, update, delete), use useEmployeeMutations()
 */

"use client";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

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

/**
 * Hook for fetching employee list data
 * Does not include mutations - use useEmployeeMutations() for create/update/delete
 * @param params - Filter, sort, and pagination parameters
 */
export function useEmployees(params: EmployeeFilters = {}) {
    const key = employeesKey(params);
    const { data, isLoading, error, mutate: refetch } = useSWR<{
        data: Employee[];
        count: number | null;
    }>(key, () => fetchEmployeesWithParams(params), {
        revalidateOnFocus: false,
    });

    return {
        employees: data?.data || [],
        total: data?.count ?? null,
        isLoading,
        error,
        mutate: refetch,
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
