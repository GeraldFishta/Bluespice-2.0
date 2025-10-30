-- Functional indexes for case-insensitive search on profiles
create index if not exists idx_profiles_email_lower on public.profiles (lower(email));
create index if not exists idx_profiles_first_name_lower on public.profiles (lower(first_name));
create index if not exists idx_profiles_last_name_lower on public.profiles (lower(last_name));


