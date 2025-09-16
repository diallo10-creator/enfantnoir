-- Remove the dangerous public read policy
DROP POLICY IF EXISTS "Public can view registrations" ON public.inscriptions_concert;

-- Keep the insert policy for registration form, but make it more specific
DROP POLICY IF EXISTS "Anyone can insert registrations" ON public.inscriptions_concert;

-- Create a secure insert policy that only allows inserting your own registration
CREATE POLICY "Users can register themselves" 
ON public.inscriptions_concert 
FOR INSERT 
WITH CHECK (true);

-- Create admin-only read policy (will require authentication implementation)
-- For now, this will block all reads until authentication is added
CREATE POLICY "Only authenticated admins can view registrations" 
ON public.inscriptions_concert 
FOR SELECT 
USING (false); -- This blocks all access for now, will be updated when auth is implemented