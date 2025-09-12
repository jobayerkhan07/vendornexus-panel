import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SYSTEM_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from '@/types/permissions';
import { supabase } from '@/integrations/supabase/client';

interface UserPermissions {
  permissions: string[];
  loading: boolean;
  hasPermission: (permissionId: string) => boolean;
  canCreateRole: (targetRole: string) => boolean;
  canImpersonate: (targetUserId: string) => Promise<boolean>;
}

export function usePermissions(): UserPermissions {
  const { user, userProfile } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && userProfile) {
      loadUserPermissions();
    } else {
      setPermissions([]);
      setLoading(false);
    }
  }, [user, userProfile]);

  const loadUserPermissions = async () => {
    if (!userProfile) return;

    try {
      // Super admin has all permissions
      if (userProfile.role === 'super_admin') {
        const allPermissions = SYSTEM_PERMISSIONS.map(p => p.id);
        setPermissions(allPermissions);
        setLoading(false);
        return;
      }

      // Get default permissions for role
      const rolePermissions = DEFAULT_ROLE_PERMISSIONS[userProfile.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || [];
      
      // TODO: In future, fetch user-specific permissions from permission_groups table
      // For now, use default role permissions
      setPermissions(rolePermissions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user permissions:', error);
      setLoading(false);
    }
  };

  const hasPermission = (permissionId: string): boolean => {
    if (!userProfile) return false;
    if (userProfile.role === 'super_admin') return true;
    return permissions.includes(permissionId);
  };

  const canCreateRole = (targetRole: string): boolean => {
    if (!userProfile) return false;
    
    const currentRole = userProfile.role;
    
    // Super admin can create admin and reseller
    if (currentRole === 'super_admin') {
      return ['admin', 'reseller'].includes(targetRole);
    }
    
    // Admin can create reseller and user (if has permission)
    if (currentRole === 'admin') {
      return ['reseller', 'user'].includes(targetRole) && hasPermission('user_management');
    }
    
    // Reseller can create user (if has permission)
    if (currentRole === 'reseller') {
      return targetRole === 'user' && hasPermission('user_management');
    }
    
    return false;
  };

  const canImpersonate = async (targetUserId: string): Promise<boolean> => {
    if (!user || !userProfile) return false;
    
    // Super admin can impersonate anyone
    if (userProfile.role === 'super_admin') return true;
    
    try {
      // Check if current user created the target user
      const { data, error } = await supabase
        .from('profiles')
        .select('created_by')
        .eq('user_id', targetUserId)
        .single();
      
      if (error) return false;
      
      return data.created_by === user.id;
    } catch (error) {
      console.error('Error checking impersonation permission:', error);
      return false;
    }
  };

  return {
    permissions,
    loading,
    hasPermission,
    canCreateRole,
    canImpersonate,
  };
}