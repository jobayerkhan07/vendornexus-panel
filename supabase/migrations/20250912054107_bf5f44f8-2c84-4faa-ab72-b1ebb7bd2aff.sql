-- Fix security vulnerability: Remove unauthorized access to phone numbers
-- This fixes the critical issue where unauthenticated users could view phone numbers

-- Drop the problematic policy that allows unauthenticated access
DROP POLICY IF EXISTS "Users can view their assigned numbers" ON public.number_pool;

-- Create a secure replacement policy that only allows authenticated users to view their assigned numbers
CREATE POLICY "Users can view their assigned numbers" 
ON public.number_pool 
FOR SELECT 
TO authenticated
USING (assigned_user_id = auth.uid());

-- Add policy for super admins if it doesn't exist
DROP POLICY IF EXISTS "Super admins can view all numbers" ON public.number_pool;
CREATE POLICY "Super admins can view all numbers" 
ON public.number_pool 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));