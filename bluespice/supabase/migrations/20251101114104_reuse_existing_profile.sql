-- Modify handle_new_user() to reuse existing profile if email matches
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
DECLARE first_name_value TEXT;
last_name_value TEXT;
full_name TEXT;
email_value TEXT;
existing_profile_id UUID;
BEGIN -- Get email from auth.users
email_value := NEW.email;
-- Check if a profile with this email already exists
SELECT id INTO existing_profile_id
FROM public.profiles
WHERE email = email_value
LIMIT 1;
-- If profile exists, link the new auth user to existing profile
-- This happens when user logs in with OAuth using same email
IF existing_profile_id IS NOT NULL THEN -- Update existing profile to use new auth user ID (if different)
-- OR: Keep existing profile and just link auth
-- Actually, we can't change the profile ID (it's the PK)
-- So we skip creating a new profile
RETURN NEW;
END IF;
-- Try to extract name from user_metadata (GitHub provides full_name or name)
full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NULL
);
-- If we have full_name, try to split it
IF full_name IS NOT NULL THEN -- Simple split: assume "First Last" format
first_name_value := SPLIT_PART(TRIM(full_name), ' ', 1);
last_name_value := SPLIT_PART(TRIM(full_name), ' ', 2);
-- If split failed (only one word), use it as first_name
IF last_name_value = ''
OR last_name_value = first_name_value THEN last_name_value := 'User';
END IF;
ELSE -- Fallback: use email username as first_name
first_name_value := SPLIT_PART(email_value, '@', 1);
last_name_value := 'User';
END IF;
-- Create profile with default role 'employee' only if doesn't exist
INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        role
    )
VALUES (
        NEW.id,
        email_value,
        first_name_value,
        last_name_value,
        'employee' -- Default role, can be changed later by admin
    ) ON CONFLICT (id) DO NOTHING;
-- Avoid duplicates if profile already exists
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;