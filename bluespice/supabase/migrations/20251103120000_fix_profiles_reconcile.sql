-- ================================
-- 🔧 Bluespice: Profile Reconcile Migration
-- Version: 2025-11-03
-- ================================

-- 1) Ensure ON UPDATE CASCADE for FKs referencing profiles.id
ALTER TABLE public.employees
DROP CONSTRAINT IF EXISTS employees_profile_id_fkey;

ALTER TABLE public.employees
ADD CONSTRAINT employees_profile_id_fkey
FOREIGN KEY (profile_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

COMMENT ON CONSTRAINT employees_profile_id_fkey ON public.employees
IS 'Ensures profile updates cascade to employees (id change safe).';

-- If payroll_periods.created_by references profiles(id), also enforce cascade
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.constraint_column_usage u
    JOIN information_schema.referential_constraints r ON r.constraint_name = u.constraint_name
    WHERE u.table_schema = 'public'
      AND u.table_name = 'payroll_periods'
      AND u.column_name = 'created_by'
  ) THEN
    BEGIN
      ALTER TABLE public.payroll_periods
      DROP CONSTRAINT IF EXISTS payroll_periods_created_by_fkey;

      ALTER TABLE public.payroll_periods
      ADD CONSTRAINT payroll_periods_created_by_fkey
      FOREIGN KEY (created_by)
      REFERENCES public.profiles(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL;
    EXCEPTION WHEN undefined_object THEN
      -- ignore if constraint name differs or column absent
      NULL;
    END;
  END IF;
END $$;

-- 2) Replace trigger function with reconciling version
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_value TEXT;
  last_name_value TEXT;
  full_name TEXT;
  email_value TEXT;
  existing_profile UUID;
BEGIN
  email_value := NEW.email;

  -- Reconcile by email: if a profile exists with same email, update its PK to NEW.id
  SELECT id INTO existing_profile
  FROM public.profiles
  WHERE email = email_value
  LIMIT 1;

  IF existing_profile IS NOT NULL THEN
    -- Update primary key; ON UPDATE CASCADE will handle dependent rows
    UPDATE public.profiles
    SET id = NEW.id
    WHERE email = email_value;

    RETURN NEW;
  END IF;

  -- Extract full name or fallback to email username
  full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NULL
  );

  IF full_name IS NOT NULL THEN
    first_name_value := SPLIT_PART(TRIM(full_name), ' ', 1);
    last_name_value := SPLIT_PART(TRIM(full_name), ' ', 2);
    IF last_name_value = '' OR last_name_value = first_name_value THEN
      last_name_value := 'User';
    END IF;
  ELSE
    first_name_value := SPLIT_PART(email_value, '@', 1);
    last_name_value := 'User';
  END IF;

  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (NEW.id, email_value, first_name_value, last_name_value, 'employee')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION handle_new_user() IS 'Auto-creates or reconciles profiles on new user signup (handles OAuth re-signup safely).';

-- 3) Recreate trigger to ensure it points to the current function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 4) Helper function for RBAC checks (admin or hr)
CREATE OR REPLACE FUNCTION public.is_admin_or_hr(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public AS $$
SELECT EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.id = uid AND p.role IN ('admin', 'hr')
);
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_or_hr(uuid) TO authenticated, anon;

COMMENT ON FUNCTION public.is_admin_or_hr(uuid)
IS 'Checks if given user ID belongs to admin or hr role.';

-- 5) Ensure unique index on profiles.email exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'profiles_email_key'
  ) THEN
    BEGIN
      CREATE UNIQUE INDEX profiles_email_key ON public.profiles(email);
    EXCEPTION WHEN duplicate_table THEN
      NULL;
    END;
  END IF;
END $$;

-- 6) Log
DO $$ BEGIN RAISE NOTICE '✅ Migration 2025-11-03 fix_profiles_reconcile applied.'; END $$;


