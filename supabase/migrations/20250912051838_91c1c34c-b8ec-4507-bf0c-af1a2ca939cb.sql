-- Add permission groups table for managing user permissions
CREATE TABLE IF NOT EXISTS public.permission_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  role app_role NOT NULL,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on permission_groups
ALTER TABLE public.permission_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for permission_groups
CREATE POLICY "Super admins can manage permission groups" 
ON public.permission_groups 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can view permission groups" 
ON public.permission_groups 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update updated_at column if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for permission_groups
CREATE TRIGGER update_permission_groups_updated_at
BEFORE UPDATE ON public.permission_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default permission groups
INSERT INTO public.permission_groups (name, description, role, permissions, is_default) VALUES
('Default Admin', 'Default permissions for admin users', 'admin', ARRAY[
  'user_management', 'balance_management', 'vendor_management', 
  'number_management', 'payment_management', 'smtp_management', 
  'campaign_management', 'sms_management', 'reporting'
], true),
('Default Reseller', 'Default permissions for reseller users', 'reseller', ARRAY[
  'user_management', 'balance_management', 'vendor_management', 
  'number_management', 'smtp_management', 'campaign_management', 
  'sms_management', 'reporting'
], true),
('Default User', 'Default permissions for regular users', 'user', ARRAY[
  'number_management', 'sms_management', 'reporting'
], true);

-- Create user_permission_groups table to assign permission groups to users
CREATE TABLE IF NOT EXISTS public.user_permission_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  permission_group_id UUID NOT NULL REFERENCES public.permission_groups(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, permission_group_id)
);

-- Enable RLS on user_permission_groups
ALTER TABLE public.user_permission_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for user_permission_groups
CREATE POLICY "Super admins can manage user permission groups" 
ON public.user_permission_groups 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can manage user permission groups" 
ON public.user_permission_groups 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own permission groups" 
ON public.user_permission_groups 
FOR SELECT 
USING (user_id = auth.uid());