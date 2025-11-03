-- Migration: Add payroll period fields
ALTER TABLE payroll_periods
ADD COLUMN frequency VARCHAR(20) DEFAULT 'monthly' CHECK (
        frequency IN ('weekly', 'bi-weekly', 'monthly', 'quarterly')
    );
ALTER TABLE payroll_periods
ADD COLUMN description TEXT;
ALTER TABLE payroll_periods
ADD COLUMN total_gross DECIMAL(15, 2) DEFAULT 0;
ALTER TABLE payroll_periods
ADD COLUMN total_net DECIMAL(15, 2) DEFAULT 0;
ALTER TABLE payroll_periods
ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE payroll_periods
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE payroll_periods
ADD COLUMN approved_by UUID REFERENCES profiles(id);
-- Comments for documentation
COMMENT ON COLUMN payroll_periods.frequency IS 'Payroll frequency: weekly, bi-weekly, monthly, quarterly';
COMMENT ON COLUMN payroll_periods.description IS 'Optional description/notes for the period';
COMMENT ON COLUMN payroll_periods.total_gross IS 'Total gross pay for all employees in this period (computed)';
COMMENT ON COLUMN payroll_periods.total_net IS 'Total net pay for all employees in this period (computed)';
COMMENT ON COLUMN payroll_periods.processed_at IS 'Timestamp when payroll was processed/generated';
COMMENT ON COLUMN payroll_periods.approved_at IS 'Timestamp when payroll was approved';
COMMENT ON COLUMN payroll_periods.approved_by IS 'Profile ID of who approved the payroll';