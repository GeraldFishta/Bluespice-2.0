-- Auto-create profile trigger for new users
-- This trigger automatically creates a profile when a new user signs up

-- Function to extract first name and last name from user_metadata or email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_value TEXT;
  last_name_value TEXT;
  full_name TEXT;
  email_value TEXT;
BEGIN
  -- Get email from auth.users
  email_value := NEW.email;
  
  -- Try to extract name from user_metadata (GitHub provides full_name or name)
  full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NULL
  );
  
  -- If we have full_name, try to split it
  IF full_name IS NOT NULL THEN
    -- Simple split: assume "First Last" format
    first_name_value := SPLIT_PART(TRIM(full_name), ' ', 1);
    last_name_value := SPLIT_PART(TRIM(full_name), ' ', 2);
    
    -- If split failed (only one word), use it as first_name
    IF last_name_value = '' OR last_name_value = first_name_value THEN
      last_name_value := 'User';
    END IF;
  ELSE
    -- Fallback: use email username as first_name
    first_name_value := SPLIT_PART(email_value, '@', 1);
    last_name_value := 'User';
  END IF;
  
  -- Create profile with default role 'employee'
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role
  ) VALUES (
    NEW.id,
    email_value,
    first_name_value,
    last_name_value,
    'employee' -- Default role, can be changed later by admin
  )
  ON CONFLICT (id) DO NOTHING; -- Avoid duplicates if profile already exists
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that fires after a user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- RLS Policy: Allow users to insert their own profile (needed for fallback)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

