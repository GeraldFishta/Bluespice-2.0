-- View read-only per DTO Employees + Profile (shape stabile per la UI)
create or replace view public.employee_dto_v1 as
select e.id,
    e.employee_id,
    e.status,
    e.employment_type,
    e.salary,
    e.hourly_rate,
    e.manager_id,
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
        p.role,
        'department',
        p.department,
        'position',
        p.position,
        'hire_date',
        p.hire_date
    ) as profile
from public.employees e
    left join public.profiles p on p.id = e.profile_id;
-- Nota:
-- Nessuna RLS diretta sulla view: usa le RLS delle tabelle base (default SECURITY INVOKER).
-- Admin/HR vedono tutti, employee solo il proprio record via policy su employees/profiles.