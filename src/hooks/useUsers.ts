import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
  last_login: string | null;
  created_by: string | null;
  balance?: number;
  smsCount?: number;
}

interface UserStats {
  total: number;
  active: number;
  suspended: number;
  resellers: number;
}

interface UsersData {
  users: User[];
  stats: UserStats;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useUsers(): UsersData {
  const { user, userProfile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    suspended: 0,
    resellers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      loadUsers();
    }
  }, [userProfile]);

  const loadUsers = async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          email,
          full_name,
          role,
          status,
          created_at,
          last_login,
          created_by
        `);

      // Apply role-based filtering
      if (userProfile.role === 'reseller') {
        // Resellers can only see users they created + themselves
        query = query.or(`created_by.eq.${user?.id},user_id.eq.${user?.id}`);
      } else if (userProfile.role === 'admin') {
        // Admins can see users they created + resellers/users (not other admins unless they created them)
        query = query.or(`created_by.eq.${user?.id},role.in.(reseller,user)`);
      }
      // Super admins see everyone (no filter)

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Load balances for each user
      const usersWithBalances = await Promise.all(
        (data || []).map(async (userData) => {
          const { data: balanceData } = await supabase
            .from('user_balances')
            .select('current_balance')
            .eq('user_id', userData.user_id)
            .single();

          const { data: smsData } = await supabase
            .from('sms_messages')
            .select('id')
            .eq('user_id', userData.user_id);

          return {
            ...userData,
            id: userData.user_id,
            balance: balanceData?.current_balance || 0,
            smsCount: smsData?.length || 0
          };
        })
      );

      setUsers(usersWithBalances);
      
      // Calculate stats
      const total = usersWithBalances.length;
      const active = usersWithBalances.filter(u => u.status === 'active').length;
      const suspended = usersWithBalances.filter(u => u.status === 'suspended').length;
      const resellers = usersWithBalances.filter(u => u.role === 'reseller').length;
      
      setStats({ total, active, suspended, resellers });
      
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadUsers();
  };

  return {
    users,
    stats,
    loading,
    refresh
  };
}