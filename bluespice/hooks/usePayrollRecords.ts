// hooks/usePayrollRecords.ts
/**
 * Hook for payroll records data fetching only
 * For mutations (create, update, delete), use usePayrollRecordMutations()
 */

"use client";
import { useMemo } from "react";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

export interface PayrollRecord {
  id: string;
  employee_id: string;
  payroll_period_id: string;
  base_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_amount: number;
  deductions: number;
  bonuses: number;
  net_pay: number;
  status: "pending" | "approved" | "paid";
  created_at: string;
  updated_at: string;
  // Joined data
  employee?: {
    id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
    position?: string;
    department?: string;
  };
  payroll_period?: {
    id: string;
    name: string;
    status: string;
  };
}

// Filter/sort/pagination params for list
type PayrollRecordsFilters = {
  payrollPeriodId?: string; // Filter by specific payroll period
  employeeId?: string; // Filter by specific employee
  status?: "all" | "pending" | "approved" | "paid";
  sort?: string; // e.g., 'created_at' | 'net_pay' | 'employee.last_name'
  dir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  // Global filters for all-records view
  employeeName?: string; // Search by employee name
  periodName?: string; // Search by period name
  minAmount?: string; // Minimum net pay amount
  maxAmount?: string; // Maximum net pay amount
};

// SWR key generator to avoid overfetch and ensure cache correctness
const payrollRecordsKey = (p: PayrollRecordsFilters) => [
  "payroll-records",
  p.payrollPeriodId || "",
  p.employeeId || "",
  p.status || "all",
  p.sort || "created_at",
  p.dir || "desc",
  p.page || 1,
  p.pageSize || 20,
  p.employeeName || "",
  p.periodName || "",
  p.minAmount || "",
  p.maxAmount || "",
];

// Supabase fetcher for payroll records with filters/pagination
const fetchPayrollRecordsWithParams = async (p: PayrollRecordsFilters): Promise<{
  data: PayrollRecord[];
  count: number | null;
}> => {
  const {
    payrollPeriodId,
    employeeId,
    status = "all",
    sort = "created_at",
    dir = "desc",
    page = 1,
    pageSize = 20,
  } = p;

  let q = supabase
    .from("payroll_records")
    .select(`
      *,
      employee:employees(
        id,
        employee_id,
        department,
        position,
        profile:profiles(first_name, last_name)
      ),
      payroll_period:payroll_periods(id, name, status)
    `, { count: "exact" });

  if (payrollPeriodId) q = q.eq("payroll_period_id", payrollPeriodId);
  if (employeeId) q = q.eq("employee_id", employeeId);
  if (status !== "all") q = q.eq("status", status);

  q = q.order(sort, { ascending: dir === "asc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;

  // Transform the nested data structure
  const transformedData = (data as any[])?.map(record => ({
    ...record,
    employee: record.employee ? {
      id: record.employee.id,
      employee_id: record.employee.employee_id,
      department: record.employee.department,
      position: record.employee.position,
      first_name: record.employee.profile?.first_name,
      last_name: record.employee.profile?.last_name,
    } : undefined,
    payroll_period: record.payroll_period ? {
      id: record.payroll_period.id,
      name: record.payroll_period.name,
      status: record.payroll_period.status,
    } : undefined,
  })) || [];

  return { data: transformedData as PayrollRecord[], count: count ?? null };
};

/**
 * Hook for fetching payroll records list data
 * Does not include mutations - use usePayrollRecordMutations() for create/update/delete
 * @param params - Filter, sort, and pagination parameters
 */
export function usePayrollRecords(params: PayrollRecordsFilters = {}) {
  const key = payrollRecordsKey(params);
  const { data, isLoading, error, mutate: refetch } = useSWR<{
    data: PayrollRecord[];
    count: number | null;
  }>(key, () => fetchPayrollRecordsWithParams(params), {
    revalidateOnFocus: false,
  });

  // Apply client-side filters for advanced search
  const filteredRecords = useMemo(() => {
    if (!data?.data) return [];

    let filtered = [...data.data];

    const {
      employeeName,
      periodName,
      minAmount,
      maxAmount,
    } = params;

    // Filter by employee name (search in first_name + last_name)
    if (employeeName?.trim()) {
      const searchTerm = employeeName.toLowerCase().trim();
      filtered = filtered.filter(record => {
        const fullName = `${record.employee?.first_name || ''} ${record.employee?.last_name || ''}`.toLowerCase();
        return fullName.includes(searchTerm);
      });
    }

    // Filter by period name
    if (periodName?.trim()) {
      const searchTerm = periodName.toLowerCase().trim();
      filtered = filtered.filter(record =>
        record.payroll_period?.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by minimum amount
    if (minAmount && !isNaN(Number(minAmount))) {
      const min = Number(minAmount);
      filtered = filtered.filter(record => record.net_pay >= min);
    }

    // Filter by maximum amount
    if (maxAmount && !isNaN(Number(maxAmount))) {
      const max = Number(maxAmount);
      filtered = filtered.filter(record => record.net_pay <= max);
    }

    return filtered;
  }, [data?.data, params]);

  return {
    payrollRecords: filteredRecords,
    total: data?.count ?? null,
    isLoading,
    error,
    mutate: refetch,
  };
}

// Hook for single payroll record
export function usePayrollRecord(id: string | null) {
  const fetchPayrollRecord = async (): Promise<PayrollRecord | null> => {
    if (!id) return null;

    const { data, error } = await supabase
      .from("payroll_records")
      .select(`
        *,
        employee:employees(
          id,
          employee_id,
          department,
          position,
          profile:profiles(first_name, last_name)
        ),
        payroll_period:payroll_periods(id, name, status)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    // Transform the nested data structure
    const record = data as any;
    return {
      ...record,
      employee: record.employee ? {
        id: record.employee.id,
        employee_id: record.employee.employee_id,
        department: record.employee.department,
        position: record.employee.position,
        first_name: record.employee.profile?.first_name,
        last_name: record.employee.profile?.last_name,
      } : undefined,
      payroll_period: record.payroll_period ? {
        id: record.payroll_period.id,
        name: record.payroll_period.name,
        status: record.payroll_period.status,
      } : undefined,
    } as PayrollRecord;
  };

  const { data: payrollRecord, isLoading, error } = useSWR<PayrollRecord | null>(
    id ? `payroll-record-${id}` : null,
    fetchPayrollRecord
  );

  return {
    payrollRecord: payrollRecord || null,
    isLoading,
    error,
  };
}
