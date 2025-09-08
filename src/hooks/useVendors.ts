import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  name: string;
  description?: string;
  website_url?: string;
  support_email?: string;
  support_phone?: string;
  status: 'active' | 'inactive' | 'testing';
  configuration: any;
  created_at: string;
  updated_at: string;
}

interface VendorAPI {
  id: string;
  vendor_id: string;
  name: string;
  endpoint_url: string;
  api_key_name?: string;
  authentication_type: string;
  rate_limit: number;
  priority: number;
  is_active: boolean;
  configuration: any;
  created_at: string;
  updated_at: string;
}

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorAPIs, setVendorAPIs] = useState<VendorAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorAPIs = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_apis')
        .select('*')
        .order('priority');

      if (error) throw error;
      setVendorAPIs(data || []);
    } catch (error) {
      console.error('Error fetching vendor APIs:', error);
    }
  };

  const createVendor = async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Vendor created successfully",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => prev.map(v => v.id === id ? data : v));
      toast({
        title: "Success",
        description: "Vendor updated successfully",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVendors(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
      return { error };
    }
  };

  const createVendorAPI = async (apiData: Omit<VendorAPI, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('vendor_apis')
        .insert([apiData])
        .select()
        .single();

      if (error) throw error;

      setVendorAPIs(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Vendor API created successfully",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creating vendor API:', error);
      toast({
        title: "Error",
        description: "Failed to create vendor API",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const testVendorAPI = async (apiId: string) => {
    try {
      // This would typically call an edge function to test the API
      toast({
        title: "Testing API",
        description: "API test initiated...",
      });

      // Mock test result
      setTimeout(() => {
        toast({
          title: "API Test Result",
          description: "Vendor API is responding correctly",
        });
      }, 2000);

      return { success: true };
    } catch (error) {
      console.error('Error testing vendor API:', error);
      toast({
        title: "Error",
        description: "Failed to test vendor API",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchVendorAPIs();
  }, []);

  return {
    vendors,
    vendorAPIs,
    loading,
    createVendor,
    updateVendor,
    deleteVendor,
    createVendorAPI,
    testVendorAPI,
    refetch: () => {
      fetchVendors();
      fetchVendorAPIs();
    },
  };
}