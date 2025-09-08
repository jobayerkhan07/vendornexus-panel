-- Create comprehensive database schema for SMS Reseller Platform

-- Create enums for various status types
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE vendor_status AS ENUM ('active', 'inactive', 'testing');
CREATE TYPE message_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'rejected');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'running', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'error', 'success');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Update profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'active',
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  support_email TEXT,
  support_phone TEXT,
  status vendor_status DEFAULT 'active',
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create vendor_apis table
CREATE TABLE public.vendor_apis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  api_key_name TEXT,
  authentication_type TEXT DEFAULT 'bearer',
  rate_limit INTEGER DEFAULT 1000,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pricing_groups table
CREATE TABLE public.pricing_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_rate DECIMAL(10,4) DEFAULT 0.0000,
  markup_percentage DECIMAL(5,2) DEFAULT 0.00,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create number_pool table
CREATE TABLE public.number_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  country_code TEXT NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  assigned_user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  capabilities TEXT[] DEFAULT ARRAY['sms'],
  monthly_cost DECIMAL(10,2) DEFAULT 0.00,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sms_messages table
CREATE TABLE public.sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  message_body TEXT NOT NULL,
  status message_status DEFAULT 'pending',
  vendor_id UUID REFERENCES public.vendors(id),
  vendor_message_id TEXT,
  cost DECIMAL(10,4) DEFAULT 0.0000,
  direction TEXT DEFAULT 'outbound', -- outbound, inbound
  campaign_id UUID,
  delivery_status TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  message_template TEXT NOT NULL,
  from_number TEXT NOT NULL,
  recipient_list TEXT[] NOT NULL,
  status campaign_status DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0.00,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create smtp_configurations table
CREATE TABLE public.smtp_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL DEFAULT 587,
  smtp_username TEXT NOT NULL,
  smtp_password TEXT NOT NULL, -- This should be encrypted
  use_tls BOOLEAN DEFAULT true,
  from_email TEXT NOT NULL,
  from_name TEXT,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_tested_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_templates table
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT,
  text_content TEXT,
  template_variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- stripe, paypal, etc
  configuration JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_method_id UUID REFERENCES public.payment_methods(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status payment_status DEFAULT 'pending',
  provider_transaction_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Add foreign key for campaign_id in sms_messages
ALTER TABLE public.sms_messages 
ADD CONSTRAINT fk_sms_messages_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE SET NULL;

-- Enable RLS on all tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.number_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smtp_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendors
CREATE POLICY "Admins can manage all vendors" ON public.vendors
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view active vendors" ON public.vendors
  FOR SELECT USING (status = 'active');

-- Create RLS policies for vendor_apis
CREATE POLICY "Admins can manage vendor APIs" ON public.vendor_apis
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for pricing_groups
CREATE POLICY "Admins can manage pricing groups" ON public.pricing_groups
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view pricing groups" ON public.pricing_groups
  FOR SELECT USING (true);

-- Create RLS policies for number_pool
CREATE POLICY "Admins can manage number pool" ON public.number_pool
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their assigned numbers" ON public.number_pool
  FOR SELECT USING (assigned_user_id = auth.uid() OR auth.uid() IS NULL);

-- Create RLS policies for sms_messages
CREATE POLICY "Users can manage their SMS messages" ON public.sms_messages
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all SMS messages" ON public.sms_messages
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for campaigns
CREATE POLICY "Users can manage their campaigns" ON public.campaigns
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all campaigns" ON public.campaigns
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for SMTP configurations
CREATE POLICY "Users can manage their SMTP configs" ON public.smtp_configurations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all SMTP configs" ON public.smtp_configurations
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for email templates
CREATE POLICY "Users can manage their email templates" ON public.email_templates
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for payment methods
CREATE POLICY "Admins can manage payment methods" ON public.payment_methods
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view active payment methods" ON public.payment_methods
  FOR SELECT USING (is_active = true);

-- Create RLS policies for payments
CREATE POLICY "Users can view their payments" ON public.payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert payments" ON public.payments
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for system settings
CREATE POLICY "Admins can manage system settings" ON public.system_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view public settings" ON public.system_settings
  FOR SELECT USING (is_public = true);

-- Create updated_at triggers for all tables
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_apis_updated_at
  BEFORE UPDATE ON public.vendor_apis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_groups_updated_at
  BEFORE UPDATE ON public.pricing_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_number_pool_updated_at
  BEFORE UPDATE ON public.number_pool
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sms_messages_updated_at
  BEFORE UPDATE ON public.sms_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_smtp_configurations_updated_at
  BEFORE UPDATE ON public.smtp_configurations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('app_name', '"SMS Reseller Platform"', 'Application name', true),
('app_version', '"1.0.0"', 'Application version', true),
('default_country_code', '"+1"', 'Default country code for phone numbers', true),
('max_sms_length', '160', 'Maximum SMS message length', true),
('smtp_rate_limit', '100', 'SMTP rate limit per hour', false),
('sms_rate_limit', '1000', 'SMS rate limit per hour', false);

-- Insert default payment method
INSERT INTO public.payment_methods (name, provider, configuration, is_active) VALUES
('Credit Card', 'stripe', '{"description": "Credit card payments via Stripe"}', true);

-- Create indexes for performance
CREATE INDEX idx_sms_messages_user_id ON public.sms_messages(user_id);
CREATE INDEX idx_sms_messages_status ON public.sms_messages(status);
CREATE INDEX idx_sms_messages_created_at ON public.sms_messages(created_at);
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);