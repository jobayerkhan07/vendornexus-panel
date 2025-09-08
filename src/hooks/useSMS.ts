import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SMSMessage {
  id: string;
  user_id: string;
  from_number: string;
  to_number: string;
  message_body: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'rejected';
  vendor_id?: string;
  vendor_message_id?: string;
  cost: number;
  direction: string;
  campaign_id?: string;
  delivery_status?: string;
  error_message?: string;
  sent_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  message_template: string;
  from_number: string;
  recipient_list: string[];
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled';
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  total_cost: number;
  settings: any;
  created_at: string;
  updated_at: string;
}

export function useSMS() {
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sms_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching SMS messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch SMS messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const sendSMS = async (
    toNumber: string,
    message: string,
    fromNumber: string
  ) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('sms_messages')
        .insert([{
          user_id: user.id,
          from_number: fromNumber,
          to_number: toNumber,
          message_body: message,
          status: 'pending',
          direction: 'outbound',
          cost: 0.01, // Mock cost
        }])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [data, ...prev]);
      toast({
        title: "SMS Sent",
        description: `Message sent to ${toNumber}`,
      });

      // Here you would typically call an edge function to actually send the SMS
      // For now, we'll simulate processing
      setTimeout(() => {
        updateMessageStatus(data.id, 'sent');
      }, 1000);

      return { data, error: null };
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: "Error",
        description: "Failed to send SMS",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateMessageStatus = async (
    messageId: string,
    status: SMSMessage['status'],
    errorMessage?: string
  ) => {
    try {
      const updates: any = { status };
      
      if (status === 'sent') {
        updates.sent_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      } else if (status === 'failed' && errorMessage) {
        updates.error_message = errorMessage;
      }

      const { error } = await supabase
        .from('sms_messages')
        .update(updates)
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          ...campaignData,
          user_id: user.id,
          total_recipients: campaignData.recipient_list.length,
        }])
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => [data, ...prev]);
      toast({
        title: "Campaign Created",
        description: `Campaign "${data.name}" created successfully`,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const startCampaign = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({
          status: 'running',
          started_at: new Date().toISOString(),
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => prev.map(c => c.id === campaignId ? data : c));
      toast({
        title: "Campaign Started",
        description: "Campaign is now running",
      });

      // Here you would call an edge function to process the campaign
      return { data, error: null };
    } catch (error) {
      console.error('Error starting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to start campaign",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const getMessageStats = () => {
    const total = messages.length;
    const sent = messages.filter(m => m.status === 'sent' || m.status === 'delivered').length;
    const delivered = messages.filter(m => m.status === 'delivered').length;
    const failed = messages.filter(m => m.status === 'failed').length;
    const totalCost = messages.reduce((sum, m) => sum + Number(m.cost), 0);

    return {
      total,
      sent,
      delivered,
      failed,
      deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
      totalCost,
    };
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchCampaigns();
    }
  }, [user]);

  return {
    messages,
    campaigns,
    loading,
    sendSMS,
    updateMessageStatus,
    createCampaign,
    startCampaign,
    getMessageStats,
    refetch: () => {
      fetchMessages();
      fetchCampaigns();
    },
  };
}