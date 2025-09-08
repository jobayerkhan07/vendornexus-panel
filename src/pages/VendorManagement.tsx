import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { useVendors } from '@/hooks/useVendors';
import { 
  Plus, 
  Edit, 
  Trash2, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Globe,
  Settings
} from 'lucide-react';

// Type definitions
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

const VendorManagement = () => {
  const { vendors, vendorAPIs, loading, createVendor, updateVendor, deleteVendor, createVendorAPI, testVendorAPI } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAPIDialog, setShowAPIDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    support_email: '',
    support_phone: '',
    status: 'active' as 'active' | 'inactive' | 'testing',
    configuration: {},
  });

  const [apiFormData, setApiFormData] = useState({
    vendor_id: '',
    name: '',
    endpoint_url: '',
    api_key_name: '',
    authentication_type: 'bearer',
    rate_limit: 1000,
    priority: 1,
    is_active: true,
    configuration: {},
  });

  const handleCreateVendor = async () => {
    const result = await createVendor(formData);
    if (result.data) {
      setShowCreateDialog(false);
      setFormData({
        name: '',
        description: '',
        website_url: '',
        support_email: '',
        support_phone: '',
        status: 'active',
        configuration: {},
      });
    }
  };

  const handleCreateAPI = async () => {
    const result = await createVendorAPI(apiFormData);
    if (result.data) {
      setShowAPIDialog(false);
      setApiFormData({
        vendor_id: '',
        name: '',
        endpoint_url: '',
        api_key_name: '',
        authentication_type: 'bearer',
        rate_limit: 1000,
        priority: 1,
        is_active: true,
        configuration: {},
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default', icon: <CheckCircle className="w-3 h-3" /> },
      inactive: { variant: 'secondary', icon: <XCircle className="w-3 h-3" /> },
      testing: { variant: 'outline', icon: <Clock className="w-3 h-3" /> },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge variant={config.variant as any} className="gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const vendorColumns = [
    {
      key: 'name' as keyof Vendor,
      label: 'Name',
      render: (value: any, row: Vendor) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'status' as keyof Vendor,
      label: 'Status',
      render: (value: any) => getStatusBadge(value),
    },
    {
      key: 'website_url' as keyof Vendor,
      label: 'Website',
      render: (value: any) => {
        return value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {value}
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      key: 'support_email' as keyof Vendor,
      label: 'Support Email',
      render: (value: any) => {
        return value ? (
          <a href={`mailto:${value}`} className="text-primary hover:underline">
            {value}
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      key: 'id' as keyof Vendor,
      label: 'Actions',
      render: (value: any, row: Vendor) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteVendor(row.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const apiColumns = [
    {
      key: 'name' as keyof VendorAPI,
      label: 'API Name',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'vendor_id' as keyof VendorAPI,
      label: 'Vendor',
      render: (value: any) => {
        const vendor = vendors.find(v => v.id === value);
        return vendor ? vendor.name : 'Unknown';
      },
    },
    {
      key: 'endpoint_url' as keyof VendorAPI,
      label: 'Endpoint',
      render: (value: any) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{value}</code>
      ),
    },
    {
      key: 'rate_limit' as keyof VendorAPI,
      label: 'Rate Limit',
      render: (value: any) => `${value}/hour`,
    },
    {
      key: 'is_active' as keyof VendorAPI,
      label: 'Status',
      render: (value: any) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id' as keyof VendorAPI,
      label: 'Actions',
      render: (value: any, row: VendorAPI) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => testVendorAPI(row.id)}>
            <TestTube className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage SMS vendors and their API configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAPIDialog} onOpenChange={setShowAPIDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Add API
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Vendor API</DialogTitle>
                <DialogDescription>
                  Add a new API configuration for a vendor
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vendor_id">Vendor</Label>
                  <Select
                    value={apiFormData.vendor_id}
                    onValueChange={(value) => setApiFormData(prev => ({ ...prev, vendor_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="api_name">API Name</Label>
                  <Input
                    id="api_name"
                    value={apiFormData.name}
                    onChange={(e) => setApiFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Twilio SMS API"
                  />
                </div>
                <div>
                  <Label htmlFor="endpoint_url">Endpoint URL</Label>
                  <Input
                    id="endpoint_url"
                    value={apiFormData.endpoint_url}
                    onChange={(e) => setApiFormData(prev => ({ ...prev, endpoint_url: e.target.value }))}
                    placeholder="https://api.example.com/sms"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rate_limit">Rate Limit (per hour)</Label>
                    <Input
                      id="rate_limit"
                      type="number"
                      value={apiFormData.rate_limit}
                      onChange={(e) => setApiFormData(prev => ({ ...prev, rate_limit: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={apiFormData.priority}
                      onChange={(e) => setApiFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAPIDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAPI}>Create API</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Vendor</DialogTitle>
                <DialogDescription>
                  Add a new SMS vendor to your platform
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Vendor Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Twilio"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the vendor"
                  />
                </div>
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                    placeholder="https://www.example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="support_email">Support Email</Label>
                    <Input
                      id="support_email"
                      type="email"
                      value={formData.support_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, support_email: e.target.value }))}
                      placeholder="support@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="support_phone">Support Phone</Label>
                    <Input
                      id="support_phone"
                      value={formData.support_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, support_phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive' | 'testing') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVendor}>Create Vendor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="apis">API Configurations</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>SMS Vendors</CardTitle>
              <CardDescription>
                Manage your SMS service providers and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={vendorColumns}
                data={vendors}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apis">
          <Card>
            <CardHeader>
              <CardTitle>API Configurations</CardTitle>
              <CardDescription>
                Manage API endpoints and their settings for each vendor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={apiColumns}
                data={vendorAPIs}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorManagement;