-- Migration: Move department, position, hire_date from profiles to employees
-- These fields are employment-specific, not user identity
-- STEP 1: Add new columns to employees table
-- Spiegazione: ALTER TABLE aggiunge nuove colonne alla tabella employees
ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS department TEXT,
    ADD COLUMN IF NOT EXISTS position TEXT,
    ADD COLUMN IF NOT EXISTS hire_date DATE;
-- STEP 2: Migrate existing data from profiles to employees
-- Spiegazione: UPDATE con JOIN copia i dati da profiles a employees
UPDATE public.employees e
SET department = COALESCE(e.department, p.department),
    position = COALESCE(e.position, p.position),
    hire_date = COALESCE(e.hire_date, p.hire_date)
FROM public.profiles p
WHERE e.profile_id = p.id;
-- STEP 3: Drop and recreate employee_dto_v1 view
-- IMPORTANTE: DROP VIEW è necessario perché CREATE OR REPLACE non può cambiare 
-- il numero/ordine delle colonne in modo significativo
-- Spiegazione: DROP VIEW elimina completamente la view, poi la ricreiamo con la nuova struttura
DROP VIEW IF EXISTS public.employee_dto_v1;
CREATE VIEW public.employee_dto_v1 AS
SELECT e.id,
    e.employee_id,
    e.status,
    e.employment_type,
    e.salary,
    e.hourly_rate,
    e.manager_id,
    e.department,
    -- Ora da employees!
    e.position,
    -- Ora da employees!
    e.hire_date,
    -- Ora da employees!
    e.created_at,
    e.updated_at,
    jsonb_build_object(
        'id',
        p.id,
        'email',
        p.email,
        'first_name',
        p.first_name,
        'last_name',
        p.last_name,
        'role',
        p.role -- Rimossi: department, position, hire_date (ora sono in e.)
    ) AS profile
FROM public.employees e
    LEFT JOIN public.profiles p ON p.id = e.profile_id;
-- STEP 4: Drop columns from profiles table (NOW it's safe)
-- Spiegazione: Ora possiamo eliminarle perché la view non le usa più
ALTER TABLE public.profiles DROP COLUMN IF EXISTS department,
    DROP COLUMN IF EXISTS position,
    DROP COLUMN IF EXISTS hire_date;
-- STEP 5: Add comments explaining the change
COMMENT ON COLUMN public.employees.department IS 'Employee department - moved from profiles as this is employment-specific, not user identity';
COMMENT ON COLUMN public.employees.position IS 'Employee position - moved from profiles as this is employment-specific, not user identity';
COMMENT ON COLUMN public.employees.hire_date IS 'Employee hire date - moved from profiles as this is employment-specific, not user identity';