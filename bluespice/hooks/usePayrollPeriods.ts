// hooks/usePayrollPeriods.ts
/**
 * Hook for payroll periods data fetching only
 * For mutations (create, update, delete), use usePayrollPeriodMutations()
 */

"use client";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

export interface PayrollPeriod {
  id: string;
  name: string;
  start_date: string; // Date string in YYYY-MM-DD format
  end_date: string; // Date string in YYYY-MM-DD format
  status: "draft" | "processing" | "approved" | "paid";
  frequency: "weekly" | "bi-weekly" | "monthly" | "quarterly";
  description?: string;
  total_gross: number;
  total_net: number;
  processed_at?: string;
  approved_at?: string;
  approved_by?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joined with profiles for creator and approver
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  approver?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Filter/sort/pagination params for list
type PayrollPeriodFilters = {
  search?: string;
  status?: "all" | "draft" | "processing" | "approved" | "paid";
  frequency?: "all" | "weekly" | "bi-weekly" | "monthly" | "quarterly";
  sort?: string; // e.g., 'created_at' | 'name' | 'start_date'
  dir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

// SWR key generator to avoid overfetch and ensure cache correctness
const payrollPeriodsKey = (p: PayrollPeriodFilters) => [
  "payroll-periods",
  p.search || "",
  p.status || "all",
  p.frequency || "all",
  p.sort || "created_at",
  p.dir || "desc",
  p.page || 1,
  p.pageSize || 20,
];

// Supabase fetcher for payroll periods with filters/pagination
const fetchPayrollPeriodsWithParams = async (p: PayrollPeriodFilters): Promise<{
  data: PayrollPeriod[];
  count: number | null;
}> => {
  const {
    search,
    status = "all",
    frequency = "all",
    sort = "created_at",
    dir = "desc",
    page = 1,
    pageSize = 20,
  } = p;

  let q = supabase
    .from("payroll_periods")
    .select(`
      *,
      creator:created_by(id, first_name, last_name, email),
      approver:approved_by(id, first_name, last_name, email)
    `, { count: "exact" });

  if (search) {
    q = q.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`
    );
  }
  if (status !== "all") q = q.eq("status", status);
  if (frequency !== "all") q = q.eq("frequency", frequency);

  q = q.order(sort, { ascending: dir === "asc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;
  return { data: (data as PayrollPeriod[]) || [], count: count ?? null };
};

/**
 * Hook for fetching payroll periods list data
 * Does not include mutations - use usePayrollPeriodMutations() for create/update/delete
 * @param params - Filter, sort, and pagination parameters
 */
export function usePayrollPeriods(params: PayrollPeriodFilters = {}) {
  const key = payrollPeriodsKey(params);
  const { data, isLoading, error, mutate: refetch } = useSWR<{
    data: PayrollPeriod[];
    count: number | null;
  }>(key, () => fetchPayrollPeriodsWithParams(params), {
    revalidateOnFocus: false,
  });

  return {
    payrollPeriods: data?.data || [],
    total: data?.count ?? null,
    isLoading,
    error,
    mutate: refetch,
  };
}

// Hook for single payroll period
export function usePayrollPeriod(id: string | null) {
  const fetchPayrollPeriod = async (): Promise<PayrollPeriod | null> => {
    if (!id) return null;

    const { data, error } = await supabase
      .from("payroll_periods")
      .select(`
        *,
        creator:created_by(id, first_name, last_name, email),
        approver:approved_by(id, first_name, last_name, email)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return (data as PayrollPeriod) || null;
  };

  const { data: payrollPeriod, isLoading, error } = useSWR<PayrollPeriod | null>(
    id ? `payroll-period-${id}` : null,
    fetchPayrollPeriod
  );

  return {
    payrollPeriod: payrollPeriod || null,
    isLoading,
    error,
  };
}
