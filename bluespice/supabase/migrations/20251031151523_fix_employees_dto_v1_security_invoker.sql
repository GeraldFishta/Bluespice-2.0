-- Fix: Add SECURITY INVOKER to employee_dto_v1 view
-- This ensures the view respects RLS policies from the underlying tables
-- Without this, the view would bypass RLS using SECURITY DEFINER (postgres user permissions)
DROP VIEW IF EXISTS public.employee_dto_v1;
CREATE VIEW public.employee_dto_v1 WITH (security_invoker = true) AS
SELECT e.id,
    e.employee_id,
    e.status,
    e.employment_type,
    e.salary,
    e.hourly_rate,
    e.manager_id,
    e.department,
    e.position,
    e.hire_date,
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
        p.role
    ) AS profile
FROM public.employees e
    LEFT JOIN public.profiles p ON p.id = e.profile_id;
-- Comment: View now respects RLS policies - admin/hr see all, employees see only their own data
COMMENT ON VIEW public.employee_dto_v1 IS 'Employee DTO view with SECURITY INVOKER - respects RLS policies from employees and profiles tables';