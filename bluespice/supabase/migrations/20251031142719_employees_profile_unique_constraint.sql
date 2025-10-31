-- Add UNIQUE constraint on employees.profile_id to enforce 1:1 relationship
-- This ensures one profile can only have one employee record
-- Step 1: Safety check - verify no duplicates exist
-- (This should pass since we verified manually, but good practice)
DO $$
DECLARE duplicate_count INTEGER;
BEGIN
SELECT COUNT(*) INTO duplicate_count
FROM (
        SELECT profile_id
        FROM public.employees
        WHERE profile_id IS NOT NULL
        GROUP BY profile_id
        HAVING COUNT(*) > 1
    ) duplicates;
IF duplicate_count > 0 THEN RAISE EXCEPTION 'Cannot add UNIQUE constraint: % duplicate profile_id(s) found. Please resolve duplicates first.',
duplicate_count;
END IF;
END $$;
-- Step 2: Add UNIQUE constraint on profile_id
ALTER TABLE public.employees
ADD CONSTRAINT unique_profile_employee UNIQUE (profile_id);
-- Step 3: Add comment explaining the constraint
COMMENT ON CONSTRAINT unique_profile_employee ON public.employees IS 'Ensures one-to-one relationship: each profile can have only one employee record. This enforces business logic where one person = one employee role.';