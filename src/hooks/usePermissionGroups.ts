import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SYSTEM_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, PermissionGroup } from '@/types/permissions';
import { supabase } from '@/integrations/supabase/client';

interface PermissionGroupsData {
  permissionGroups: PermissionGroup[];
  loading: boolean;
  createGroup: (group: { name: string; description: string; role: string; permissions: string[] }) => Promise<void>;
  updateGroup: (id: string, updates: { name?: string; description?: string; permissions?: string[] }) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePermissionGroups(): PermissionGroupsData {
  const { user, userProfile } = useAuth();
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      loadPermissionGroups();
    }
  }, [userProfile]);

  const loadPermissionGroups = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('permission_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedGroups: PermissionGroup[] = (data || []).map(group => ({
        id: group.id,
        name: group.name,
        description: group.description || '',
        targetRole: group.role as any,
        permissions: group.permissions || [],
        userCount: 0, // TODO: Calculate from user_permission_groups
        createdBy: group.created_by || '',
        createdAt: group.created_at,
        isDefault: group.is_default
      }));

      setPermissionGroups(formattedGroups);
    } catch (error) {
      console.error('Error loading permission groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (group: { name: string; description: string; role: string; permissions: string[] }) => {
    try {
      const { error } = await supabase
        .from('permission_groups')
        .insert({
          name: group.name,
          description: group.description,
          role: group.role as any,
          permissions: group.permissions,
          is_default: false,
          created_by: user?.id
        });

      if (error) throw error;
      await loadPermissionGroups();
    } catch (error) {
      console.error('Error creating permission group:', error);
      throw error;
    }
  };

  const updateGroup = async (id: string, updates: { name?: string; description?: string; permissions?: string[] }) => {
    try {
      const { error } = await supabase
        .from('permission_groups')
        .update({
          name: updates.name,
          description: updates.description,
          permissions: updates.permissions
        })
        .eq('id', id);

      if (error) throw error;
      await loadPermissionGroups();
    } catch (error) {
      console.error('Error updating permission group:', error);
      throw error;
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('permission_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPermissionGroups();
    } catch (error) {
      console.error('Error deleting permission group:', error);
      throw error;
    }
  };

  const refresh = async () => {
    await loadPermissionGroups();
  };

  return {
    permissionGroups,
    loading,
    createGroup,
    updateGroup,
    deleteGroup,
    refresh
  };
}