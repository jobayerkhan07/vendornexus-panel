import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserBalance {
  id: string;
  user_id: string;
  current_balance: number;
  credit_limit: number;
  available_balance: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description?: string;
  status: string;
  reference_id?: string;
  related_user_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  related_user?: {
    email: string;
  };
}

export const useBalance = () => {
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBalanceOperation = async (operation: string, params: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('balance-operations', {
        body: { operation, ...params },
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async () => {
    try {
      const data = await handleBalanceOperation('get_balance');
      setBalance(data.balance);
      return data.balance;
    } catch (err) {
      console.error('Failed to get balance:', err);
    }
  };

  const topUpBalance = async (amount: number) => {
    try {
      const data = await handleBalanceOperation('top_up', { amount });
      toast({
        title: "Success",
        description: data.message,
      });
      await getBalance(); // Refresh balance
      await getTransactions(); // Refresh transactions
      return data;
    } catch (err) {
      console.error('Failed to top up balance:', err);
    }
  };

  const allocateCredit = async (toUserId: string, amount: number) => {
    try {
      const data = await handleBalanceOperation('allocate_credit', {
        to_user_id: toUserId,
        amount
      });
      toast({
        title: "Success",
        description: data.message,
      });
      await getBalance(); // Refresh balance
      await getTransactions(); // Refresh transactions
      return data;
    } catch (err) {
      console.error('Failed to allocate credit:', err);
    }
  };

  const getTransactions = async (limit = 50, offset = 0) => {
    try {
      const data = await handleBalanceOperation('get_transactions', { limit, offset });
      setTransactions(data.transactions);
      return data.transactions;
    } catch (err) {
      console.error('Failed to get transactions:', err);
    }
  };

  const lockBalance = async (targetUserId: string, locked: boolean) => {
    try {
      const data = await handleBalanceOperation('lock_balance', {
        target_user_id: targetUserId,
        locked
      });
      toast({
        title: "Success",
        description: data.message,
      });
      return data;
    } catch (err) {
      console.error('Failed to lock/unlock balance:', err);
    }
  };

  const getUserBalances = async () => {
    try {
      const data = await handleBalanceOperation('get_user_balances');
      return data.balances;
    } catch (err) {
      console.error('Failed to get user balances:', err);
    }
  };

  // Auto-load balance and transactions on mount
  useEffect(() => {
    getBalance();
    getTransactions();
  }, []);

  // Set up real-time subscriptions for balance updates
  useEffect(() => {
    const channel = supabase
      .channel('balance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_balances'
        },
        (payload) => {
          console.log('Balance updated:', payload);
          getBalance();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          console.log('New transaction:', payload);
          getTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    balance,
    transactions,
    loading,
    error,
    getBalance,
    topUpBalance,
    allocateCredit,
    getTransactions,
    lockBalance,
    getUserBalances,
  };
};