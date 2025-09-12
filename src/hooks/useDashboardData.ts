import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
  totalUsers: number;
  activeNumbers: number;
  smsReceived: number;
  revenue: string;
  userGrowth: string;
  smsGrowth: string;
  revenueGrowth: string;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  details: string;
  amount: string;
  timestamp: string;
  status: string;
}

interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: RecentActivity[];
  loading: boolean;
}

export function useDashboardData(): DashboardData {
  const { userProfile } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    activeNumbers: 0,
    smsReceived: 0,
    revenue: '$0',
    userGrowth: '+0%',
    smsGrowth: '+0%',
    revenueGrowth: '+0%'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      loadDashboardData();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load metrics based on user role
      await Promise.all([
        loadUserMetrics(),
        loadSmsMetrics(),
        loadRevenueMetrics(),
        loadRecentActivity()
      ]);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, status, created_at');
      
      if (error) throw error;
      
      const totalUsers = data?.length || 0;
      const activeUsers = data?.filter(u => u.status === 'active').length || 0;
      
      // Calculate growth (mock calculation for now)
      const userGrowth = '+12.5%';
      
      setMetrics(prev => ({
        ...prev,
        totalUsers,
        userGrowth
      }));
    } catch (error) {
      console.error('Error loading user metrics:', error);
    }
  };

  const loadSmsMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_messages')
        .select('id, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      const smsReceived = data?.length || 0;
      const smsGrowth = '+8.2%'; // Mock calculation
      
      setMetrics(prev => ({
        ...prev,
        smsReceived,
        smsGrowth
      }));
    } catch (error) {
      console.error('Error loading SMS metrics:', error);
    }
  };

  const loadRevenueMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, transaction_type, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .in('transaction_type', ['top_up', 'credit_allocation']);
      
      if (error) throw error;
      
      const totalRevenue = data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const revenue = `$${totalRevenue.toLocaleString()}`;
      const revenueGrowth = '+15.3%'; // Mock calculation
      
      setMetrics(prev => ({
        ...prev,
        revenue,
        revenueGrowth
      }));
    } catch (error) {
      console.error('Error loading revenue metrics:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          transaction_type,
          description,
          created_at,
          status,
          user_id,
          profiles!inner(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      const formattedActivity: RecentActivity[] = data?.map(t => ({
        id: t.id,
        user: (t.profiles as any)?.email || 'Unknown User',
        action: getActionLabel(t.transaction_type),
        details: t.description || 'Transaction',
        amount: `$${Number(t.amount).toFixed(2)}`,
        timestamp: formatTimestamp(t.created_at),
        status: t.status
      })) || [];
      
      setRecentActivity(formattedActivity);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const getActionLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'top_up': 'Balance Top-up',
      'credit_allocation': 'Credit Allocation',
      'debit': 'Balance Debit',
      'refund': 'Refund',
      'balance_adjustment': 'Balance Adjustment',
      'auto_repayment': 'Auto Repayment'
    };
    return labels[type] || type;
  };

  const formatTimestamp = (timestamp: string): string => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  // Load number pool data
  useEffect(() => {
    const loadNumberPool = async () => {
      try {
        const { data, error } = await supabase
          .from('number_pool')
          .select('id')
          .eq('is_active', true);
        
        if (error) throw error;
        
        setMetrics(prev => ({
          ...prev,
          activeNumbers: data?.length || 0
        }));
      } catch (error) {
        console.error('Error loading number pool:', error);
      }
    };
    
    if (userProfile) {
      loadNumberPool();
    }
  }, [userProfile]);

  return {
    metrics,
    recentActivity,
    loading
  };
}