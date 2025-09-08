-- Fix RLS security issues for all new tables

-- Enable RLS on all new tables
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

-- Create updated_at triggers for all new tables
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

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('app_name', '"SMS Reseller Platform"', 'Application name', true),
('app_version', '"1.0.0"', 'Application version', true),
('default_country_code', '"+1"', 'Default country code for phone numbers', true),
('max_sms_length', '160', 'Maximum SMS message length', true),
('smtp_rate_limit', '100', 'SMTP rate limit per hour', false),
('sms_rate_limit', '1000', 'SMS rate limit per hour', false)
ON CONFLICT (key) DO NOTHING;

-- Insert default payment method
INSERT INTO public.payment_methods (name, provider, configuration, is_active) VALUES
('Credit Card', 'stripe', '{"description": "Credit card payments via Stripe"}', true)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sms_messages_user_id ON public.sms_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_status ON public.sms_messages(status);
CREATE INDEX IF NOT EXISTS idx_sms_messages_created_at ON public.sms_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);