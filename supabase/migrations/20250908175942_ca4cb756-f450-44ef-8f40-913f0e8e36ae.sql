-- Complete the Balance Management System (missing components)

-- Create credit allocations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.credit_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_allocations ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_balances_user_id ON public.user_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_allocations_from_user ON public.credit_allocations(from_user_id);
CREATE INDEX IF NOT EXISTS idx_credit_allocations_to_user ON public.credit_allocations(to_user_id);

-- Function to get or create user balance
CREATE OR REPLACE FUNCTION public.get_or_create_user_balance(_user_id UUID)
RETURNS public.user_balances
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  balance_record public.user_balances;
BEGIN
  SELECT * INTO balance_record 
  FROM public.user_balances 
  WHERE user_id = _user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.user_balances (user_id, current_balance, credit_limit)
    VALUES (_user_id, 0.00, 0.00)
    RETURNING * INTO balance_record;
  END IF;
  
  RETURN balance_record;
END;
$$;

-- Function to update balance with transaction logging
CREATE OR REPLACE FUNCTION public.update_user_balance(
  _user_id UUID,
  _amount DECIMAL(12,2),
  _transaction_type transaction_type,
  _description TEXT DEFAULT NULL,
  _related_user_id UUID DEFAULT NULL,
  _created_by UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  balance_record public.user_balances;
  transaction_id UUID;
  balance_before DECIMAL(12,2);
  balance_after DECIMAL(12,2);
BEGIN
  -- Get or create balance record
  SELECT * INTO balance_record FROM public.get_or_create_user_balance(_user_id);
  
  -- Check if balance is locked
  IF balance_record.is_locked THEN
    RAISE EXCEPTION 'User balance is locked';
  END IF;
  
  balance_before := balance_record.current_balance;
  
  -- Update balance based on transaction type
  CASE _transaction_type
    WHEN 'credit_allocation', 'top_up', 'refund' THEN
      balance_after := balance_before + _amount;
    WHEN 'debit', 'auto_repayment' THEN
      -- Check if sufficient balance (including credit limit)
      IF (balance_before + balance_record.credit_limit) < _amount THEN
        RAISE EXCEPTION 'Insufficient balance';
      END IF;
      balance_after := balance_before - _amount;
    WHEN 'balance_adjustment' THEN
      balance_after := balance_before + _amount; -- Can be positive or negative
  END CASE;
  
  -- Update balance
  UPDATE public.user_balances 
  SET current_balance = balance_after, updated_at = now()
  WHERE user_id = _user_id;
  
  -- Create transaction record
  INSERT INTO public.transactions (
    user_id, 
    transaction_type, 
    amount, 
    balance_before, 
    balance_after, 
    description,
    status,
    related_user_id,
    created_by
  )
  VALUES (
    _user_id, 
    _transaction_type, 
    _amount, 
    balance_before, 
    balance_after, 
    _description,
    'completed',
    _related_user_id,
    COALESCE(_created_by, auth.uid())
  )
  RETURNING id INTO transaction_id;
  
  RETURN transaction_id;
END;
$$;

-- Function to allocate credit from one user to another
CREATE OR REPLACE FUNCTION public.allocate_credit(
  _from_user_id UUID,
  _to_user_id UUID,
  _amount DECIMAL(12,2)
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  from_balance public.user_balances;
  allocation_id UUID;
  transaction_id UUID;
BEGIN
  -- Validate amount
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  -- Get sender balance
  SELECT * INTO from_balance FROM public.get_or_create_user_balance(_from_user_id);
  
  -- Check if sender has sufficient balance
  IF from_balance.current_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient balance to allocate credit';
  END IF;
  
  -- Debit from sender
  PERFORM public.update_user_balance(
    _from_user_id,
    _amount,
    'credit_allocation',
    'Credit allocated to user',
    _to_user_id,
    auth.uid()
  );
  
  -- Credit to receiver (as credit limit increase)
  UPDATE public.user_balances 
  SET credit_limit = credit_limit + _amount, updated_at = now()
  WHERE user_id = _to_user_id;
  
  -- If receiver doesn't exist, create balance record
  IF NOT FOUND THEN
    INSERT INTO public.user_balances (user_id, current_balance, credit_limit)
    VALUES (_to_user_id, 0.00, _amount);
  END IF;
  
  -- Get the transaction ID for the debit
  SELECT id INTO transaction_id 
  FROM public.transactions 
  WHERE user_id = _from_user_id 
    AND transaction_type = 'credit_allocation' 
    AND related_user_id = _to_user_id
    AND amount = _amount
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Record credit allocation
  INSERT INTO public.credit_allocations (from_user_id, to_user_id, amount, transaction_id)
  VALUES (_from_user_id, _to_user_id, _amount, transaction_id)
  RETURNING id INTO allocation_id;
  
  RETURN allocation_id;
END;
$$;

-- Function to lock/unlock user balance
CREATE OR REPLACE FUNCTION public.toggle_balance_lock(_user_id UUID, _locked BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_balances 
  SET is_locked = _locked, updated_at = now()
  WHERE user_id = _user_id;
  
  RETURN FOUND;
END;
$$;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own balance" ON public.user_balances;
DROP POLICY IF EXISTS "Admins can view all balances" ON public.user_balances;
DROP POLICY IF EXISTS "Resellers can view their created users balances" ON public.user_balances;
DROP POLICY IF EXISTS "Admins can update all balances" ON public.user_balances;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Resellers can view their users transactions" ON public.transactions;
DROP POLICY IF EXISTS "System can insert transactions" ON public.transactions;

-- RLS Policies for user_balances
CREATE POLICY "Users can view their own balance" ON public.user_balances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all balances" ON public.user_balances
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Resellers can view their created users balances" ON public.user_balances
  FOR SELECT USING (
    has_role(auth.uid(), 'reseller'::app_role) AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_balances.user_id AND created_by = auth.uid())
  );

CREATE POLICY "Admins can update all balances" ON public.user_balances
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for transactions  
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Resellers can view their users transactions" ON public.transactions
  FOR SELECT USING (
    has_role(auth.uid(), 'reseller'::app_role) AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = transactions.user_id AND created_by = auth.uid())
  );

CREATE POLICY "System can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for credit_allocations
CREATE POLICY "Users can view allocations they made or received" ON public.credit_allocations
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Admins can view all credit allocations" ON public.credit_allocations
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert credit allocations" ON public.credit_allocations
  FOR INSERT WITH CHECK (true);