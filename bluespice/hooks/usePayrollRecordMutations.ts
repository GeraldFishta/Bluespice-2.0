// hooks/usePayrollRecordMutations.ts
/**
 * Hook for payroll record mutations (create, update, delete)
 * Separated from data fetching to avoid unnecessary fetches
 */

"use client";
import { supabase } from "@/lib/supabase";
import { useToast } from "./useToast";
import { payrollRecordsCache, payrollCache } from "@/lib/cache";

interface PayrollRecordCreateData {
  employee_id: string;
  payroll_period_id: string;
  base_salary: number;
  overtime_hours?: number;
  overtime_rate?: number;
  deductions?: number;
  bonuses?: number;
  status?: "pending" | "approved" | "paid";
}

interface PayrollRecordUpdateData {
  base_salary?: number;
  overtime_hours?: number;
  overtime_rate?: number;
  deductions?: number;
  bonuses?: number;
  status?: "pending" | "approved" | "paid";
}

/**
 * Hook for payroll record mutations only
 * Does not trigger any data fetching - use usePayrollRecords() for data fetching
 */
export function usePayrollRecordMutations() {
  const toast = useToast();

  const createPayrollRecord = async (recordData: PayrollRecordCreateData) => {
    try {
      // Calculate overtime amount and net pay
      const overtimeAmount = (recordData.overtime_hours || 0) * (recordData.overtime_rate || 0);
      const grossPay = recordData.base_salary + overtimeAmount + (recordData.bonuses || 0);
      const netPay = grossPay - (recordData.deductions || 0);

      const { data, error } = await supabase
        .from("payroll_records")
        .insert({
          ...recordData,
          overtime_amount: overtimeAmount,
          net_pay: netPay,
        })
        .select()
        .single();

      if (error) throw error;

      // Invalidate caches
      payrollRecordsCache.invalidatePayrollRecordsForPeriod(recordData.payroll_period_id);
      toast.success("Payroll record created successfully!");
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to create payroll record");
      return { success: false, error: err.message };
    }
  };

  const updatePayrollRecord = async (
    id: string,
    recordData: PayrollRecordUpdateData
  ) => {
    try {
      // Get current record to calculate new values
      const { data: currentRecord, error: fetchError } = await supabase
        .from("payroll_records")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Merge with existing data
      const updatedData = {
        ...currentRecord,
        ...recordData,
      };

      // Recalculate overtime amount and net pay
      const overtimeAmount = (updatedData.overtime_hours || 0) * (updatedData.overtime_rate || 0);
      const grossPay = updatedData.base_salary + overtimeAmount + (updatedData.bonuses || 0);
      const netPay = grossPay - (updatedData.deductions || 0);

      const { data, error } = await supabase
        .from("payroll_records")
        .update({
          ...recordData,
          overtime_amount: overtimeAmount,
          net_pay: netPay,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate caches
      payrollRecordsCache.invalidatePayrollRecord(id);
      payrollRecordsCache.invalidatePayrollRecordsForPeriod(currentRecord.payroll_period_id);
      toast.success("Payroll record updated successfully!");
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to update payroll record");
      return { success: false, error: err.message };
    }
  };

  const deletePayrollRecord = async (id: string) => {
    try {
      // Get the record first to know which period to invalidate
      const { data: record, error: fetchError } = await supabase
        .from("payroll_records")
        .select("payroll_period_id")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase.from("payroll_records").delete().eq("id", id);

      if (error) throw error;

      // Invalidate caches
      payrollRecordsCache.invalidatePayrollRecordsForPeriod(record.payroll_period_id);
      toast.success("Payroll record deleted successfully!");
      return { success: true };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete payroll record");
      return { success: false, error: err.message };
    }
  };

  const approvePayrollRecord = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("payroll_records")
        .update({ status: "approved" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate caches
      payrollRecordsCache.invalidatePayrollRecord(id);
      toast.success("Payroll record approved!");
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to approve payroll record");
      return { success: false, error: err.message };
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("payroll_records")
        .update({ status: "paid" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate caches
      payrollRecordsCache.invalidatePayrollRecord(id);
      toast.success("Payroll record marked as paid!");
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to mark payroll record as paid");
      return { success: false, error: err.message };
    }
  };

  const bulkApproveRecords = async (ids: string[]) => {
    try {
      const { data, error } = await supabase
        .from("payroll_records")
        .update({ status: "approved" })
        .in("id", ids)
        .select();

      if (error) throw error;

      // Invalidate caches for affected records
      payrollRecordsCache.invalidatePayrollRecords(ids, { alsoList: true });
      toast.success(`${ids.length} payroll records approved!`);
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to approve payroll records");
      return { success: false, error: err.message };
    }
  };

  const generatePayrollRecords = async (payrollPeriodId: string) => {
    try {
      // First get all active employees
      const { data: employees, error: empError } = await supabase
        .from("employees")
        .select(`
          id,
          salary,
          hourly_rate,
          profile:profiles!inner(role)
        `)
        .eq("status", "active")
        .eq("profile.role", "employee");

      if (empError) throw empError;

      // Check for existing records to avoid duplicates
      const { data: existingRecords, error: recError } = await supabase
        .from("payroll_records")
        .select("employee_id")
        .eq("payroll_period_id", payrollPeriodId);

      if (recError) throw recError;

      const existingEmployeeIds = new Set(existingRecords?.map(r => r.employee_id) || []);

      // Filter out employees who already have records
      const employeesToProcess = (employees as any[])?.filter(
        emp => !existingEmployeeIds.has(emp.id)
      ) || [];

      if (employeesToProcess.length === 0) {
        toast.info("All active employees already have payroll records for this period");
        return { success: true, count: 0 };
      }

      // Generate payroll records for each employee
      const recordsToInsert = employeesToProcess.map(employee => ({
        employee_id: employee.id,
        payroll_period_id: payrollPeriodId,
        base_salary: employee.salary,
        overtime_hours: 0,
        overtime_rate: employee.hourly_rate || 0,
        overtime_amount: 0,
        deductions: 0,
        bonuses: 0,
        net_pay: employee.salary, // Initially same as base salary
        status: "pending" as const,
      }));

      const { data, error } = await supabase
        .from("payroll_records")
        .insert(recordsToInsert)
        .select();

      if (error) throw error;

      // Invalidate caches
      payrollRecordsCache.invalidatePayrollRecordsForPeriod(payrollPeriodId);
      toast.success(`Generated ${data?.length || 0} payroll records successfully!`);
      return { success: true, count: data?.length || 0 };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to generate payroll records");
      return { success: false, error: err.message };
    }
  };

  return {
    createPayrollRecord,
    updatePayrollRecord,
    deletePayrollRecord,
    approvePayrollRecord,
    markAsPaid,
    bulkApproveRecords,
    generatePayrollRecords,
  };
}
