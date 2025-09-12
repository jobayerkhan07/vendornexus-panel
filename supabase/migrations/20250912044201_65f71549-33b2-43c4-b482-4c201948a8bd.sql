-- Update RLS policies to handle super_admin role properly

-- Update profiles RLS policies for super_admin
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
CREATE POLICY "Super admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can create admin/reseller users" ON public.profiles;
CREATE POLICY "Super admins can create admin/reseller users" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role) 
  AND role IN ('admin'::app_role, 'reseller'::app_role)
  AND created_by = auth.uid()
);

DROP POLICY IF EXISTS "Super admins can update profiles" ON public.profiles;
CREATE POLICY "Super admins can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Update existing admin policies to not conflict with super_admin
DROP POLICY IF EXISTS "Admins can create any user type" ON public.profiles;
CREATE POLICY "Admins can create any user type" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  AND role IN ('admin'::app_role, 'reseller'::app_role, 'user'::app_role)
  AND created_by = auth.uid()
);

-- Update reseller policies to only create clients/users
DROP POLICY IF EXISTS "Resellers can create clients only" ON public.profiles;
CREATE POLICY "Resellers can create clients only" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'reseller'::app_role) 
  AND role = 'user'::app_role 
  AND created_by = auth.uid()
);

-- Update user balance policies for super_admin
DROP POLICY IF EXISTS "Super admins can view all balances" ON public.user_balances;
CREATE POLICY "Super admins can view all balances" 
ON public.user_balances 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Update other tables for super_admin access
DROP POLICY IF EXISTS "Super admins can manage all vendors" ON public.vendors;
CREATE POLICY "Super admins can manage all vendors" 
ON public.vendors 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage vendor APIs" ON public.vendor_apis;
CREATE POLICY "Super admins can manage vendor APIs" 
ON public.vendor_apis 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage pricing groups" ON public.pricing_groups;
CREATE POLICY "Super admins can manage pricing groups" 
ON public.pricing_groups 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage system settings" ON public.system_settings;
CREATE POLICY "Super admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));