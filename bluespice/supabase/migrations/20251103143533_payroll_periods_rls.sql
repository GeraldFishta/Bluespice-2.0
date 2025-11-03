-- Add missing RLS policies for payroll_periods table
-- Policy for SELECT - HR and Admin can view all, employees can view if they're creator
CREATE POLICY "Payroll periods access policy" ON payroll_periods FOR
SELECT USING (
        created_by = auth.uid()
        OR EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role IN ('admin', 'hr')
        )
    );
-- Policy for INSERT - Only HR and Admin can create payroll periods
CREATE POLICY "Payroll periods create policy" ON payroll_periods FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role IN ('admin', 'hr')
        )
    );
-- Policy for UPDATE - Only HR and Admin can update payroll periods
CREATE POLICY "Payroll periods update policy" ON payroll_periods FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role IN ('admin', 'hr')
        )
    );
-- Policy for DELETE - Only Admin can delete payroll periods
CREATE POLICY "Payroll periods delete policy" ON payroll_periods FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);