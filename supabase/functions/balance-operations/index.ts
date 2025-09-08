import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { operation, ...params } = await req.json();
    console.log(`Balance operation: ${operation} for user: ${user.id}`);

    let result;

    switch (operation) {
      case 'get_balance': {
        const { data, error } = await supabase
          .from('user_balances')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        // If no balance record exists, create one
        if (!data) {
          const { data: newBalance, error: createError } = await supabase
            .rpc('get_or_create_user_balance', { _user_id: user.id });
          
          if (createError) throw createError;
          result = { balance: newBalance };
        } else {
          result = { balance: data };
        }
        break;
      }

      case 'top_up': {
        const { amount } = params;
        
        if (!amount || amount <= 0) {
          throw new Error('Invalid amount');
        }

        const { data, error } = await supabase
          .rpc('update_user_balance', {
            _user_id: user.id,
            _amount: amount,
            _transaction_type: 'top_up',
            _description: 'Account top-up',
            _created_by: user.id
          });

        if (error) throw error;
        
        result = { 
          success: true, 
          transaction_id: data,
          message: `Successfully topped up $${amount}` 
        };
        break;
      }

      case 'allocate_credit': {
        const { to_user_id, amount } = params;
        
        if (!to_user_id || !amount || amount <= 0) {
          throw new Error('Invalid parameters');
        }

        // Check if user has permission to allocate credit
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!userProfile || !['admin', 'reseller'].includes(userProfile.role)) {
          throw new Error('Insufficient permissions to allocate credit');
        }

        const { data, error } = await supabase
          .rpc('allocate_credit', {
            _from_user_id: user.id,
            _to_user_id: to_user_id,
            _amount: amount
          });

        if (error) throw error;
        
        result = { 
          success: true, 
          allocation_id: data,
          message: `Successfully allocated $${amount} credit` 
        };
        break;
      }

      case 'get_transactions': {
        const { limit = 50, offset = 0 } = params;
        
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            related_user:related_user_id (
              email
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;
        
        result = { transactions: data };
        break;
      }

      case 'lock_balance': {
        const { target_user_id, locked } = params;
        
        // Check if user is admin
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!userProfile || userProfile.role !== 'admin') {
          throw new Error('Admin access required');
        }

        const { data, error } = await supabase
          .rpc('toggle_balance_lock', {
            _user_id: target_user_id,
            _locked: locked
          });

        if (error) throw error;
        
        result = { 
          success: true, 
          message: `Balance ${locked ? 'locked' : 'unlocked'} successfully` 
        };
        break;
      }

      case 'get_user_balances': {
        // For admins and resellers to view multiple user balances
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!userProfile || !['admin', 'reseller'].includes(userProfile.role)) {
          throw new Error('Insufficient permissions');
        }

        let query = supabase
          .from('user_balances')
          .select(`
            *,
            profile:user_id (
              email,
              role
            )
          `);

        // Resellers can only see users they created
        if (userProfile.role === 'reseller') {
          query = query.eq('profile.created_by', user.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        result = { balances: data };
        break;
      }

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Balance operation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});