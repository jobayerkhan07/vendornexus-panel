import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, Users } from "lucide-react";

const mockPriceGroups = [
  { 
    id: 1, 
    name: "Premium Group", 
    vendor: "Vendor A", 
    basePrice: "$0.05", 
    smsPrice: "$0.02", 
    freeSmsCount: 100,
    assignedUsers: 25,
    status: "Active" 
  },
  { 
    id: 2, 
    name: "Standard Group", 
    vendor: "Vendor B", 
    basePrice: "$0.08", 
    smsPrice: "$0.03", 
    freeSmsCount: 50,
    assignedUsers: 15,
    status: "Active" 
  },
  { 
    id: 3, 
    name: "Basic Group", 
    vendor: "Vendor C", 
    basePrice: "$0.12", 
    smsPrice: "$0.05", 
    freeSmsCount: 25,
    assignedUsers: 8,
    status: "Inactive" 
  },
];

const columns = [
  { key: "name" as const, label: "Group Name" },
  { key: "vendor" as const, label: "Vendor" },
  { key: "basePrice" as const, label: "Base Price" },
  { key: "smsPrice" as const, label: "SMS Price" },
  { key: "freeSmsCount" as const, label: "Free SMS" },
  { key: "assignedUsers" as const, label: "Users" },
  { 
    key: "status" as const, 
    label: "Status",
    render: (value: string) => (
      <Badge variant={value === "Active" ? "default" : "secondary"}>
        {value}
      </Badge>
    )
  },
  {
    key: "id" as const,
    label: "Actions",
    render: (_: any, row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

export default function SellPriceGroups() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sell Price Groups</h1>
          <p className="text-muted-foreground">Configure pricing for your users</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Groups</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Assigned to groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.08</div>
            <p className="text-xs text-muted-foreground">Per number</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Group Management</CardTitle>
          <CardDescription>
            Manage selling prices for numbers based on vendor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={mockPriceGroups} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}