-- Add additional employee fields for comprehensive payroll management
ALTER TABLE employees
ADD COLUMN tax_code VARCHAR(16);
ALTER TABLE employees
ADD COLUMN iban VARCHAR(27);
ALTER TABLE employees
ADD COLUMN payment_method VARCHAR(20) DEFAULT 'bank_transfer';
ALTER TABLE employees
ADD COLUMN weekly_hours DECIMAL(4, 1) DEFAULT 40.0;
ALTER TABLE employees
ADD COLUMN vacation_days INTEGER DEFAULT 26;
ALTER TABLE employees
ADD COLUMN sick_days INTEGER DEFAULT 0;
ALTER TABLE employees
ADD COLUMN contract_type VARCHAR(50);
ALTER TABLE employees
ADD COLUMN badge_id VARCHAR(20) UNIQUE;
ALTER TABLE employees
ADD COLUMN office_phone VARCHAR(20);
ALTER TABLE employees
ADD COLUMN extension VARCHAR(10);
-- Add comments for documentation
COMMENT ON COLUMN employees.tax_code IS 'Tax code / Codice fiscale';
COMMENT ON COLUMN employees.iban IS 'IBAN for salary payments';
COMMENT ON COLUMN employees.payment_method IS 'Payment method: bank_transfer, check, cash';
COMMENT ON COLUMN employees.weekly_hours IS 'Contract weekly hours (default 40)';
COMMENT ON COLUMN employees.vacation_days IS 'Annual vacation days entitlement';
COMMENT ON COLUMN employees.sick_days IS 'Accumulated sick days';
COMMENT ON COLUMN employees.contract_type IS 'Contract type: Indeterminato, Determinato, etc.';
COMMENT ON COLUMN employees.badge_id IS 'Employee badge/access card ID';
COMMENT ON COLUMN employees.office_phone IS 'Office phone number';
COMMENT ON COLUMN employees.extension IS 'Phone extension number';