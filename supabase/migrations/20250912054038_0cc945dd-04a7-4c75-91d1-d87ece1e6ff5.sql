-- Fix security vulnerability: Remove unauthorized access to phone numbers
-- This fixes the issue where unauthenticated users could view phone numbers

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can view their assigned numbers" ON public.number_pool;

-- Create new secure policies
-- 1. Users can only view numbers assigned to them (authenticated users only)
CREATE POLICY "Users can view their assigned numbers" 
ON public.number_pool 
FOR SELECT 
TO authenticated
USING (assigned_user_id = auth.uid());

-- 2. Admins can view all numbers (existing admin policy should cover this, but ensuring it's explicit)
CREATE POLICY "Admins can view all numbers" 
ON public.number_pool 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Super admins can view all numbers
CREATE POLICY "Super admins can view all numbers" 
ON public.number_pool 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));