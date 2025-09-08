import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BalanceOperationRequest {
  operation: 'top_up' | 'allocate_credit' | 'get_balance' | 'get_transactions' | 'lock_balance';
  user_id?: string;
  to_user_id?: string;
  amount?: number;
  locked?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: BalanceOperationRequest = await req.json();
    const { operation } = body;

    console.log(`Balance operation: ${operation} for user: ${user.id}`);

    switch (operation) {
      case 'get_balance': {
        const targetUserId = body.user_id || user.id;
        
        const { data: balance, error } = await supabase
          .from('user_balances')
          .select('*')
          .eq('user_id', targetUserId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        // Create balance if doesn't exist
        if (!balance) {
          const { data: newBalance, error: insertError } = await supabase
            .from('user_balances')
            .insert({
              user_id: targetUserId,
              current_balance: 0,
              credit_limit: 0
            })
            .select()
            .single();

          if (insertError) throw insertError;
          return new Response(
            JSON.stringify({ balance: newBalance }), 
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ balance }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'top_up': {
        if (!body.amount || body.amount <= 0) {
          throw new Error('Invalid amount');
        }

        const { data, error } = await supabase.rpc('update_user_balance', {
          _user_id: user.id,
          _amount: body.amount,
          _transaction_type: 'top_up',
          _description: 'Account top-up',
          _related_user_id: null,
          _created_by: user.id
        });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, transaction_id: data }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'allocate_credit': {
        if (!body.to_user_id || !body.amount || body.amount <= 0) {
          throw new Error('Invalid parameters');
        }

        const { data, error } = await supabase.rpc('allocate_credit', {
          _from_user_id: user.id,
          _to_user_id: body.to_user_id,
          _amount: body.amount
        });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, allocation_id: data }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_transactions': {
        const targetUserId = body.user_id || user.id;
        
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select(`
            *,
            related_user:related_user_id(email),
            creator:created_by(email)
          `)
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        return new Response(
          JSON.stringify({ transactions }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'lock_balance': {
        if (!body.user_id) {
          throw new Error('User ID required');
        }

        const { data, error } = await supabase.rpc('toggle_balance_lock', {
          _user_id: body.user_id,
          _locked: body.locked ?? true
        });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, locked: body.locked }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid operation');
    }

  } catch (error) {
    console.error('Error in balance-operations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});