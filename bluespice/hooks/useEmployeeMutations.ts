// hooks/useEmployeeMutations.ts
/**
 * Hook for employee mutations (create, update, delete)
 * Separated from data fetching to avoid unnecessary fetches
 */

"use client";
import { supabase } from "@/lib/supabase";
import { useToast } from "./useToast";
import { employeesCache } from "@/lib/cache";

interface EmployeeCreateData {
  profile_id: string;
  employee_id: string;
  salary: number;
  hourly_rate?: number;
  employment_type: "full-time" | "part-time" | "contract";
  status?: "active" | "inactive" | "terminated";
  manager_id?: string;
  // ✅ AGGIUNGI: department, position, hire_date (spostati da profiles)
  department?: string | null;
  position?: string | null;
  hire_date?: string | null;
}

// ✅ NUOVO
interface EmployeeUpdateData {
  employee_id?: string;
  salary?: number;
  hourly_rate?: number | null;
  employment_type?: "full-time" | "part-time" | "contract";
  status?: "active" | "inactive" | "terminated";
  manager_id?: string;
  // ✅ AGGIUNGI: department, position, hire_date (spostati da profiles)
  department?: string | null;
  position?: string | null;
  hire_date?: string | null;
}

/**
 * Hook for employee mutations only
 * Does not trigger any data fetching - use useEmployees() for data fetching
 */
export function useEmployeeMutations() {
  const toast = useToast();

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

  const updateEmployee = async (
    id: string,
    employeeData: EmployeeUpdateData
  ) => {
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
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
