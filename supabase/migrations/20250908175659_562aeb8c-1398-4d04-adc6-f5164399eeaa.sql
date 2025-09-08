-- Fix security warnings by setting proper search_path for all functions

-- Update get_or_create_user_balance function
CREATE OR REPLACE FUNCTION public.get_or_create_user_balance(_user_id UUID)
RETURNS public.user_balances
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update update_user_balance function
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
SET search_path = public
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

-- Update allocate_credit function
CREATE OR REPLACE FUNCTION public.allocate_credit(
  _from_user_id UUID,
  _to_user_id UUID,
  _amount DECIMAL(12,2)
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update toggle_balance_lock function
CREATE OR REPLACE FUNCTION public.toggle_balance_lock(_user_id UUID, _locked BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_balances 
  SET is_locked = _locked, updated_at = now()
  WHERE user_id = _user_id;
  
  RETURN FOUND;
END;
$$;

-- Update existing functions to have proper search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE user_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;