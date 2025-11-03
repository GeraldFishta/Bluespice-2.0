-- Function to get role by email (bypasses RLS for reconciliation)
-- This allows frontend to find profiles by email even when RLS blocks them
CREATE OR REPLACE FUNCTION public.get_role_by_email(email_value TEXT)
RETURNS TABLE(id UUID, role TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.role
  FROM public.profiles p
  WHERE p.email = email_value
  ORDER BY 
    -- Prioritize non-employee roles
    CASE WHEN p.role IN ('admin', 'hr') THEN 0 ELSE 1 END,
    -- Then by creation date (newest first)
    p.created_at DESC
  LIMIT 1;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_role_by_email(TEXT) TO authenticated, anon;

COMMENT ON FUNCTION public.get_role_by_email(TEXT)
IS 'Gets profile role by email (bypasses RLS) - used for reconciliation when OAuth creates new auth users with same email.';

