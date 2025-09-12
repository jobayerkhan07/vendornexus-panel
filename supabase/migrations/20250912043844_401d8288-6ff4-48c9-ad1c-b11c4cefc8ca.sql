-- Add super_admin role to app_role enum in separate transaction
ALTER TYPE app_role ADD VALUE 'super_admin';