-- Modify handle_new_user() to prevent duplicate profiles
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
DECLARE existing_profile_id UUID;
BEGIN -- Check if profile exists with this email
SELECT id INTO existing_profile_id
FROM public.profiles
WHERE email = NEW.email
LIMIT 1;
IF existing_profile_id IS NOT NULL THEN -- Profile exists: we should NOT create a new one
-- But we can't change the auth user ID, so we need to handle this differently
-- For now, raise an error or log it
RAISE EXCEPTION 'Profile already exists for email %. Cannot create duplicate.',
NEW.email;
END IF;
-- Create new profile only if email doesn't exist
INSERT INTO public.profiles (id, email, first_name, last_name, role)
VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            SPLIT_PART(TRIM(NEW.raw_user_meta_data->>'name'), ' ', 1),
            SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(
            NULLIF(
                SPLIT_PART(TRIM(NEW.raw_user_meta_data->>'name'), ' ', 2),
                ''
            ),
            'User'
        ),
        'employee'
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;