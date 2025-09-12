import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, UserPlus, Shield, Eye, EyeOff, Building2, DollarSign, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { UserRole, SYSTEM_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, PermissionGroup, Permission } from "@/types/permissions";
import { useToast } from "@/hooks/use-toast";

// Mock data
const currentUserRole: UserRole = "super_admin"; // This would come from auth context

// Mock vendor data
const mockVendors = [
  {
    id: "1",
    name: "Twilio",
    type: "API",
    status: "active",
    requiresCredentials: true
  },
  {
    id: "2",
    name: "MessageBird",
    type: "API",
    status: "active",
    requiresCredentials: true
  },
  {
    id: "3",
    name: "Plivo",
    type: "Manual",
    status: "active",
    requiresCredentials: false
  }
];

// Mock price groups data
const mockPriceGroups = [
  {
    id: "1",
    name: "Premium Group",
    vendor: "Twilio",
    basePrice: "0.05",
    smsPrice: "0.02",
    targetRole: "reseller",
    createdBy: "admin",
    countries: ["US", "CA", "UK"]
  },
  {
    id: "2",
    name: "Standard Group",
    vendor: "MessageBird",
    basePrice: "0.08",
    smsPrice: "0.03",
    targetRole: "reseller",
    createdBy: "admin",
    countries: ["US", "EU"]
  },
  {
    id: "3",
    name: "Client Basic",
    vendor: "Plivo",
    basePrice: "0.12",
    smsPrice: "0.05",
    targetRole: "client",
    createdBy: "reseller",
    countries: ["Global"]
  }
];

const mockPermissionGroups: PermissionGroup[] = [
  {
    id: "1",
    name: "Reseller Standard",
    description: "Standard reseller permissions with user management",
    targetRole: "reseller",
    permissions: ["users.view", "users.create", "sms.send", "sms.bulk", "reports.view"],
    createdBy: "super-admin",
    createdAt: "2024-01-15",
    isDefault: true
  },
  {
    id: "2",
    name: "User Basic",
    description: "Basic user access to SMS services",
    targetRole: "user",
    permissions: ["sms.send", "sms.templates", "sms.history", "reports.view"],
    createdBy: "admin-1",
    createdAt: "2024-01-20",
    isDefault: false
  }
];

interface CreateUserFormData {
  email: string;
  name: string;
  role: UserRole | "";
  status: "active" | "inactive" | "suspended";
  balance: string;
  balanceType: "credit" | "prepaid";
  selectedVendors: string[];
  vendorCredentials: Record<string, "admin" | "own">;
  selectedPriceGroups: string[];
}

export default function CreateUser() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: "",
    name: "",
    role: "",
    status: "active",
    balance: "",
    balanceType: "credit",
    selectedVendors: [],
    vendorCredentials: {},
    selectedPriceGroups: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.name || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Role-specific validation
    if (formData.role === "reseller" && (formData.selectedVendors.length === 0 || formData.selectedPriceGroups.length === 0)) {
      toast({
        title: "Error", 
        description: "Resellers must have at least one vendor and one price group selected",
        variant: "destructive"
      });
      return;
    }

    console.log("Creating user:", formData);
    toast({
      title: "Success",
      description: "User created successfully!"
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Link to="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create New User</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Add a new user with role-specific permissions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="role">User Role *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="reseller">Reseller</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: "active" | "inactive" | "suspended") => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Balance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              placeholder="0.00"
            />
            <div className="text-sm text-muted-foreground">
              Can be negative to give user credit. Your available balance will be locked accordingly.
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balanceType">Balance Type</Label>
            <Select 
              value={formData.balanceType} 
              onValueChange={(value: "credit" | "prepaid") => 
                setFormData({ ...formData, balanceType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select balance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit (Negative Balance)</SelectItem>
                <SelectItem value="prepaid">Prepaid (Positive Balance)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vendor Selection */}
        {(formData.role === "reseller" || formData.role === "user") && (
          <div className="space-y-4 p-4 sm:p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Vendor Access & Pricing</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Available Vendors</Label>
                <div className="grid grid-cols-1 gap-3">
                  {mockVendors.map((vendor) => (
                    <div key={vendor.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Checkbox
                          id={`vendor-${vendor.id}`}
                          checked={formData.selectedVendors.includes(vendor.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                selectedVendors: [...formData.selectedVendors, vendor.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedVendors: formData.selectedVendors.filter(id => id !== vendor.id)
                              });
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <label htmlFor={`vendor-${vendor.id}`} className="text-sm font-medium text-foreground cursor-pointer block truncate">
                            {vendor.name}
                          </label>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">Type: {vendor.type}</span>
                            <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                              vendor.status === "active" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                            }`}>
                              {vendor.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* API Credential Selection for API vendors */}
                      {vendor.type === "API" && formData.selectedVendors.includes(vendor.id) && (
                        <div className="w-full sm:w-48">
                          <Select
                            value={formData.vendorCredentials[vendor.id] || ""}
                            onValueChange={(value: "admin" | "own") => setFormData({
                              ...formData,
                              vendorCredentials: {
                                ...formData.vendorCredentials,
                                [vendor.id]: value
                              }
                            })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select credentials" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Use Admin Credentials</SelectItem>
                              <SelectItem value="own">Use Own Credentials</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available Price Groups</Label>
                <div className="grid grid-cols-1 gap-3">
                  {mockPriceGroups.map((group) => (
                    <div key={group.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Checkbox
                          id={`price-${group.id}`}
                          checked={formData.selectedPriceGroups.includes(group.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                selectedPriceGroups: [...formData.selectedPriceGroups, group.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedPriceGroups: formData.selectedPriceGroups.filter(id => id !== group.id)
                              });
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <label htmlFor={`price-${group.id}`} className="text-sm font-medium text-foreground cursor-pointer block truncate">
                            {group.name}
                          </label>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">Countries: {group.countries.join(", ")}</span>
                            <span className="text-xs text-muted-foreground">Base Price: ${group.basePrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-border">
          <Button type="submit" className="flex-1">
            Create User
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}