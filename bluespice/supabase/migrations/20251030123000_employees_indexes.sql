-- Employees helpful indexes for filters/search
create index if not exists idx_employees_employee_id on public.employees (employee_id);
create index if not exists idx_employees_status on public.employees (status);
create index if not exists idx_employees_employment_type on public.employees (employment_type);
-- Optional: if search on email/first/last is heavy, consider functional indexes on profiles
-- create index if not exists idx_profiles_email_lower on public.profiles (lower(email));
-- create index if not exists idx_profiles_first_name_lower on public.profiles (lower(first_name));
-- create index if not exists idx_profiles_last_name_lower on public.profiles (lower(last_name));