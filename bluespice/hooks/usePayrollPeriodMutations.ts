// hooks/usePayrollPeriodMutations.ts
/**
 * Hook for payroll period mutations (create, update, delete)
 * Separated from data fetching to avoid unnecessary fetches
 */

"use client";
import { supabase } from "@/lib/supabase";
import { useToast } from "./useToast";
import { payrollCache } from "@/lib/cache";

interface PayrollPeriodCreateData {
  name: string;
  start_date: string;
  end_date: string;
  frequency?: "weekly" | "bi-weekly" | "monthly" | "quarterly";
  description?: string;
  status?: "draft" | "processing" | "approved" | "paid";
}

interface PayrollPeriodUpdateData {
  name?: string;
  start_date?: string;
  end_date?: string;
  frequency?: "weekly" | "bi-weekly" | "monthly" | "quarterly";
  description?: string;
  status?: "draft" | "processing" | "approved" | "paid";
  approved_at?: string;
  approved_by?: string;
}

/**
 * Hook for payroll period mutations only
 * Does not trigger any data fetching - use usePayrollPeriods() for data fetching
 */
export function usePayrollPeriodMutations() {
  const toast = useToast();

  const createPayrollPeriod = async (payrollPeriodData: PayrollPeriodCreateData) => {
    try {
      const { data, error } = await supabase
        .from("payroll_periods")
        .insert({
          ...payrollPeriodData,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Invalidate all payroll period caches
      payrollCache.invalidatePayrollPeriodLists();
      toast.success("Payroll period created successfully!");
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to create payroll period");
      return { success: false, error: err.message };
    }
  };

  const updatePayrollPeriod = async (
    id: string,
    payrollPeriodData: PayrollPeriodUpdateData
  ) => {
    try {
      const updateData: any = { ...payrollPeriodData };

      // Set approved_at and approved_by if status is being changed to approved
      if (payrollPeriodData.status === "approved") {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = (await supabase.auth.getUser()).data.user?.id;
      }

      const { data, error } = await supabase
        .from("payroll_periods")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate payroll period cache (both detail and lists)
      payrollCache.invalidatePayrollPeriod(id);
      toast.success("Payroll period updated successfully!");
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to update payroll period");
      return { success: false, error: err.message };
    }
  };

  const deletePayrollPeriod = async (id: string) => {
    try {
      const { error } = await supabase.from("payroll_periods").delete().eq("id", id);

      if (error) throw error;

      // Invalidate all payroll period caches
      payrollCache.invalidatePayrollPeriodLists();
      toast.success("Payroll period deleted successfully!");
      return { success: true };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete payroll period");
      return { success: false, error: err.message };
    }
  };

  const processPayrollPeriod = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("payroll_periods")
        .update({
          status: "processing",
          processed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate payroll period cache
      payrollCache.invalidatePayrollPeriod(id);
      toast.success("Payroll period processing started!");
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to start payroll processing");
      return { success: false, error: err.message };
    }
  };

  const approvePayrollPeriod = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("payroll_periods")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate payroll period cache
      payrollCache.invalidatePayrollPeriod(id);
      toast.success("Payroll period approved successfully!");
      return { success: true, data };
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to approve payroll period");
      return { success: false, error: err.message };
    }
  };

  return {
    createPayrollPeriod,
    updatePayrollPeriod,
    deletePayrollPeriod,
    processPayrollPeriod,
    approvePayrollPeriod,
  };
}
