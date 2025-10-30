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