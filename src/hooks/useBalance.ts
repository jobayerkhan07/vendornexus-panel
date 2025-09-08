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
  description: string;
  status: string;
  reference_id: string;
  related_user_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useBalance = (userId?: string) => {
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchBalance = async (targetUserId?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('balance-operations', {
        body: {
          operation: 'get_balance',
          user_id: targetUserId || userId
        }
      });

      if (error) throw error;
      setBalance(data.balance);
      return data.balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch balance',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (targetUserId?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('balance-operations', {
        body: {
          operation: 'get_transactions',
          user_id: targetUserId || userId
        }
      });

      if (error) throw error;
      setTransactions(data.transactions);
      return data.transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const topUpBalance = async (amount: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('balance-operations', {
        body: {
          operation: 'top_up',
          amount
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Successfully topped up $${amount}`,
      });

      // Refresh balance and transactions
      await Promise.all([fetchBalance(), fetchTransactions()]);
      
      return data;
    } catch (error) {
      console.error('Error topping up balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to top up balance',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const allocateCredit = async (toUserId: string, amount: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('balance-operations', {
        body: {
          operation: 'allocate_credit',
          to_user_id: toUserId,
          amount
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Successfully allocated $${amount} credit`,
      });

      // Refresh balance and transactions
      await Promise.all([fetchBalance(), fetchTransactions()]);
      
      return data;
    } catch (error) {
      console.error('Error allocating credit:', error);
      toast({
        title: 'Error',
        description: 'Failed to allocate credit',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const lockBalance = async (targetUserId: string, locked: boolean) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('balance-operations', {
        body: {
          operation: 'lock_balance',
          user_id: targetUserId,
          locked
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Balance ${locked ? 'locked' : 'unlocked'} successfully`,
      });

      // Refresh balance
      await fetchBalance();
      
      return data;
    } catch (error) {
      console.error('Error locking/unlocking balance:', error);
      toast({
        title: 'Error',
        description: `Failed to ${locked ? 'lock' : 'unlock'} balance`,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBalance();
      fetchTransactions();
    }
  }, [userId]);

  return {
    balance,
    transactions,
    loading,
    fetchBalance,
    fetchTransactions,
    topUpBalance,
    allocateCredit,
    lockBalance,
    refresh: () => Promise.all([fetchBalance(), fetchTransactions()])
  };
};