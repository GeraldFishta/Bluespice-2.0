-- Add UPDATE policy for admin/hr on profiles
-- Allows admin and hr roles to update any profile
-- Step 1: Create helper function to check if user is admin or hr
CREATE OR REPLACE FUNCTION public.is_admin_or_hr(uid uuid) RETURNS boolean LANGUAGE sql SECURITY DEFINER
SET search_path = public AS $$
SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = uid
            AND p.role IN ('admin', 'hr')
    );
$$;
-- Step 2: Grant execute permissions
REVOKE ALL ON FUNCTION public.is_admin_or_hr(uuid)
FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_or_hr(uuid) TO authenticated,
    anon;
-- Step 3: Create UPDATE policy for admin/hr
CREATE POLICY "Admins and HR can update all profiles" ON public.profiles FOR
UPDATE USING (public.is_admin_or_hr(auth.uid()));