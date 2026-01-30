-- Create a secure function to check if the current user is an admin
-- This uses a hardcoded whitelist for maximum security as requested
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_email TEXT;
BEGIN
  SELECT email INTO current_email FROM auth.users WHERE id = auth.uid();
  RETURN current_email IN ('james@live.nl', 'privemail@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy to allow Admins to UPDATE any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Policy to allow Admins to DELETE any profile (if needed later)
CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Policy to allow Admins to read everything (usually public anyway, but good to be explicit for sensitive columns if any)
CREATE POLICY "Admins can read sensitive data"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin());
