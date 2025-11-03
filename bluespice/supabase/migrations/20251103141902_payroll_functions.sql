-- Payroll calculation functions and triggers
-- Function to calculate payroll period totals
CREATE OR REPLACE FUNCTION calculate_payroll_period_totals(payroll_period_id UUID) RETURNS void AS $$ BEGIN
UPDATE payroll_periods
SET total_gross = COALESCE(
        (
            SELECT SUM(base_salary + overtime_amount + bonuses)
            FROM payroll_records
            WHERE payroll_period_id = payroll_period_id
        ),
        0
    ),
    total_net = COALESCE(
        (
            SELECT SUM(net_pay)
            FROM payroll_records
            WHERE payroll_period_id = payroll_period_id
        ),
        0
    ),
    processed_at = CASE
        WHEN processed_at IS NULL
        AND status = 'processing' THEN NOW()
        ELSE processed_at
    END,
    updated_at = NOW()
WHERE id = payroll_period_id;
END;
$$ LANGUAGE plpgsql;
-- Trigger function for payroll_records changes
CREATE OR REPLACE FUNCTION update_payroll_period_totals() RETURNS TRIGGER AS $$ BEGIN -- Calculate totals for the affected payroll period
    PERFORM calculate_payroll_period_totals(
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.payroll_period_id
            ELSE NEW.payroll_period_id
        END
    );
RETURN CASE
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
END;
END;
$$ LANGUAGE plpgsql;
-- Trigger on payroll_records
CREATE TRIGGER trigger_update_payroll_totals
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON payroll_records FOR EACH ROW EXECUTE FUNCTION update_payroll_period_totals();