-- Script di verifica e riconcilio per profiles/auth.users
-- Eseguire nel SQL Editor del dashboard Supabase
-- 1) Esistenza tabella
SELECT to_regclass('public.profiles') AS profiles_table;
-- 2) RLS abilitata (filtrata per schema)
SELECT c.relname,
    c.relrowsecurity
FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = 'profiles'
    AND n.nspname = 'public';
-- 3) Policies presenti
SELECT schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'profiles';
-- 4) Funzione auto-create profilo
SELECT proname
FROM pg_proc
WHERE proname = 'handle_new_user';
-- 5) Trigger su auth.users
SELECT t.tgname,
    n.nspname AS schema,
    c.relname AS table_name
FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE t.tgname = 'on_auth_user_created';
-- =====================================
-- Extra: Audit & Reconcile
-- =====================================
-- Auth users without a matching profile
SELECT u.id AS auth_id,
    u.email
FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
-- Orphan profiles (no matching auth user)
SELECT p.id AS profile_id,
    p.email
FROM public.profiles p
    LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;
-- Reconcile by email: align profile.id to auth.users.id (requires ON UPDATE CASCADE FKs)
DO $$ BEGIN
UPDATE public.profiles p
SET id = u.id
FROM auth.users u
WHERE p.email = u.email
    AND p.id <> u.id;
END $$;
-- Create missing profiles from auth.users
DO $$
DECLARE rec RECORD;
first_name_value TEXT;
last_name_value TEXT;
full_name TEXT;
BEGIN FOR rec IN
SELECT u.id,
    u.email,
    u.raw_user_meta_data
FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL LOOP full_name := COALESCE(
        rec.raw_user_meta_data->>'full_name',
        rec.raw_user_meta_data->>'name',
        NULL
    );
IF full_name IS NOT NULL THEN first_name_value := SPLIT_PART(TRIM(full_name), ' ', 1);
last_name_value := SPLIT_PART(TRIM(full_name), ' ', 2);
IF last_name_value = ''
OR last_name_value = first_name_value THEN last_name_value := 'User';
END IF;
ELSE first_name_value := SPLIT_PART(rec.email, '@', 1);
last_name_value := 'User';
END IF;
INSERT INTO public.profiles (id, email, first_name, last_name, role)
VALUES (
        rec.id,
        rec.email,
        first_name_value,
        last_name_value,
        'employee'
    ) ON CONFLICT (id) DO NOTHING;
END LOOP;
RAISE NOTICE '✅ verify_profiles.sql completed successfully.';
END $$;